const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client = redis.createClient();
const mysql = require('mysql');
const async = require('async');
require('dotenv').config();

const app = express();
const router = express.Router();

// SET STATIC FILE
app.use(express.static('./public'));

// SET VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extend: true }));
app.use(function(req, res, next) {
	console.log(`Request: ${req.url}, Method: ${req.method}`);
	next();
});
// STORE SESSION ON REDIS
app.use(session({
	secret: 'ssshhhhh',
	resave: false,
	saveUninitialized: true,
	store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260 })
}));
// MYSQL (POOL CONNECTION)
const pool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: 'redis_demo',
	debug: false
});
// STATUS
const STATUS = {
	failed: "failed",
	success: "success",
	null: null
}
// ACTIONS
const ACTIONS = {
	register: "register",
	checkEmail: "checkEmail",
	login: "login",
	fetchStatus: "fetchStatus",
	addStatus: "addStatus"
}
// ASYNC DATA FLOW
function handle_database(req, action, callback) {
	async.waterfall([
		// START CONNECTION
		function(callback) {
			pool.getConnection(function(err, connection) {
				if (err) throw err;
				callback(null, connection);
			});
		},
		// HANDLE WITH SQLquery STRING
		function(connection, callback) {
			let SQLquery;
			switch(action) {
				case ACTIONS.register:
					SQLquery = `INSERT INTO user_login(user_name, user_email, user_password) VALUES('${req.body.user_name}', '${req.body.user_email}', '${req.body.user_password}')`;
					break;
				case ACTIONS.checkEmail:
					SQLquery = `SELECT * FROM user_login WHERE user_email = '${req.body.user_email}'`;
					break;
				case ACTIONS.login:
					SQLquery = `SELECT * FROM user_login WHERE user_email = '${req.body.user_email}' and user_password = '${req.body.user_password}'`;
					break;
				case ACTIONS.fetchStatus:
					SQLquery = `SELECT * FROM user_status WHERE user_id = '${req.session.key.user_id}'`;
					break;
				case ACTIONS.addStatus:
					SQLquery = `INSERT INTO user_status(user_id, user_status) VALUES('${req.session.key.user_id}', '${req.body.user_status}')`;
					break;
				default:
					break;
			}
			callback(null, connection, SQLquery);
		},
		function(connection, SQLquery, callback) {
			connection.query(SQLquery, function(err, results, fields) {
				connection.release();
				if(err) { return callback(true, { results: results, status: STATUS.failed }); }
				switch(action) {
					case ACTIONS.register:
						callback(null, { results: results, status: STATUS.success });
						break;
					case ACTIONS.checkEmail:
						callback(null, { results: results, status: results.length === 0 ? STATUS.success : STATUS.failed });
						break;
					case ACTIONS.login:
						callback(null, { results: results, status: results[0] ? STATUS.success : STATUS.null });
						break;
					case ACTIONS.fetchStatus:
						callback(null, { results: results, status: results.length > 0 ? STATUS.success : STATUS.null });
					case ACTIONS.addStatus:
						callback(null, { results: results, status: STATUS.success });
					default:
						break;
				}
			});
		}

	], function(err, result) {
		if (err) {
			return callback(result);
		}
		callback(result);
	});
}

function generateResponse(response, msg) {
	const { status } = response;
	return {
		error: (status === STATUS.failed) || (status === STATUS.null) ? true : false,
		msg: msg,
	};
}

router.get('/', function(req, res) {
	res.render('index.ejs');
});

router.route('/register')
	.get(function(req, res) {
		res.render('register.ejs');
	})
	.post(function(req, res) {
		handle_database(req, ACTIONS.checkEmail, function(response) {
			if(response.status === STATUS.failed) {
				return res.json(generateResponse(response, "This email is already used"));
			}
			handle_database(req, ACTIONS.register, function(response) {
				if(response.status === STATUS.failed) {
					return res.json(generateResponse(response, "Error! while adding user"));
				}
				res.json(generateResponse(response, "Register success"));
			})
		});
	});

router.post('/login', function(req, res) {
	handle_database(req, ACTIONS.login, function(response) {
		if(response.status === STATUS.failed) {
			return res.json(generateResponse(response, "Error! while loging in"));
		}
		if(response.status === STATUS.success) {
			req.session.key = response.results[0];
			return res.json(generateResponse(response, "Login success"));
		}
		res.json(generateResponse(response, "Email or Password is not corrected or You don't have an accout."));
	});
});

router.get('/home', function(req, res) {
	if(!req.session.key) {
		res.write("<h1>Please login first<h1>");
		res.end("<a href='/'>Log in</a>")
	} else {
		res.render('home.ejs', req.session.key);
	}
});

router.get('/fetchStatus', function(req, res) {
	if(!req.session.key) {
		res.write("<h1>Please login first<h1>");
		res.end("<a href='/'>Log in</a>");
	} else {
		handle_database(req, ACTIONS.fetchStatus, function(response) {
			if(response.status === STATUS.failed) {
				return res.json(generateResponse(response, "Error! while fetching status"));
			}
			if(response.status === STATUS.success) {
				return res.json({ error: false, results: response.results });
			}
			res.json({ error: false, results: null });
		});
	}
});

router.post('/addStatus', function(req, res) {
	if(!req.session.key) {
		res.write("<h1>Please login first<h1>");
		res.end("<a href='/'>Log in</a>");
	} else {
		handle_database(req, ACTIONS.addStatus, function(response) {
			if(response.status === STATUS.failed) {
				return res.json(generateResponse(response, "Error! while adding status"));
			}
			res.json(generateResponse(response, "Added status"));
		});
	}
});

router.get('/profile', function(req, res) {
	res.write("<h1>This is profile page</h1>");
	res.end("<a href='/home'>Back to home page</a>");
});

router.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		if (err) throw err;
		res.redirect('/');
	});
});

app.use('/', router);

app.listen(3000, () => console.log("Server started: Listening at port 3000"));