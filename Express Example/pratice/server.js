const express = require('express');
const redis = require('redis');
const mysql = require('mysql');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const async = require('async');
const client = redis.createClient();
const app = express();
const router = express.Router();

// Always use MySQL pooling.
// Helpful for multiple connections.

const pool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: 'redis_demo',
	debug: false
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engin', 'ejs');
// app.engine('html', require('ejs').renderFile);

// IMPORTANT
// Here we tell Express to use Redis as session store.
// We pass Redis credentials and port information.
// And express does the rest!

app.use(session({
	secret: 'ssshhhhh',
	store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260 }),
	saveUninitialized: false,
	resave: false
}));
app.use(cookieParser("secretSign#143_!223"));
app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json());

// This is an important function.
// This function does the database handling task.
// We also use async here for control flow.

function handle_database(req, type, callback) {
	async.waterfall([
		function(callback) {
			pool.getConnection(function(err, connection) {
				if (err) {
					// if there is error, stop right away.
					// This will stop the async code execution and goes to last function
					callback(true);
				} else {
					callback(null, connection);
				}
			});
		},
		function(connection, callback) {
			let SQLquery;
			const { user_email, user_password, user_name } = req.body;
			switch(type) {
				case "login":
					SQLquery = `SELECT * FROM user_login WHERE user_email='${user_email}' AND user_password = '${user_password}'`;
					break;
				case "checkEmail":
					SQLquery = `SELECT * FROM user_login WHERE user_email='${user_email}'`;
					break;
				case "register":
					SQLquery = `INSERT INTO user_login(user_email, user_password, user_name) VALUES ('${user_email}','${user_password}','${user_name}')`;
					break;
				case "addStatus":
					SQLquery = `INSERT INTO user_status(user_id, user_status) VALUES ('${req.session.key["user_id"]}', '${status}')`;
					break;
				default:
					break;
			}
			callback(null, connection, SQLquery);
		},
		function(connection, SQLquery, callback) {
			connection.query(SQLquery, function(err, rows) {
				connection.release();
				if(!err) {
					if (type === "login") {
						callback(rows.length === 0 ? false : rows[0]);
					} else if (type === "getStatus") {
						callback(rows.length === 0 ? false : rows);
					} else {
						callback(false);
					}
				} else {
					callback(true);
				}
			})
		}
		], function(result) {
		if(typeof(result) === "boolean" && result === true) {
			callback(null);
		} else {
			callback(result);
		}
	})
}

router.use(function(req, res, next) {
	console.log(`Requested: ${req.url}, Method: ${req.method}`);
	next();
});

router.get('/', function(req, res) {
	res.render('index.ejs', { name: "Chondan" });
});

router.post('/login', function(req, res) {
	handle_database(req, "login", function(response) {
		if(response === null) {
			res.json({ "error": "true", "message": "Database error occured" });
		} else {
			if(!response) {
				res.json({
					"error": "true","message": "Login failed ! Please register" });
			} else {
				req.session.key = response;
				res.json({ "error": false, "message": "Login success" });
			}
		}
	})
});

router.get('/home', function(req, res) {
	if(req.session.key) {
		res.render('home.ejs', { email: req.session.key["user_name"] });
	} else {
		res.redirect('/');
	}
});

router.get('/fetchStatus', function(req, res) {
	if(req.session.key) {
		handle_database(req, "getStatus", function(response) {
			if(!response) {
				res.json({ "error": false, "message": "There is no status to show" });
			} else {
				res.json({ "error": false, "message": response });
			}
		});
	} else {
		res.json({ "error": true, "message": "Please login first." });
	}
});

router.post('/addStatus', function(req, res) {
	if (req.session.key) {
		handle_database(req, "addStatus", function(response) {
			if(!response) {
				res.json({ "error": false, "message": "Status is added" });
			} else {
				res.json({ "error": false, "message": "Error while adding Status"});
			}
		});
	} else {
		res.json({ "error": true, "message": "Please login first" });
	}
});

router.post('/register', function(req, res) {
	handle_database(req, "checkEmail", function(response) {
		if(response === null) {
			res.json({ "error": true, "message": "This email is already present" });
		} else {
			handle_database(req, "register", function(response) {
				if(response === null) {
					res.json({ "error": true, "message": "Error while adding user." });
				} else {
					res.json({ "error": false, "message": "Registered successfully." });
				}
			});
		}
	});
});

router.get('/logout', function(req, res) {
	if(req.session.key) {
		req.session.destroy(function() {
			res.redirect('/');
		});
	} else {
		res.redirect('/');
	}
});

app.use('/', router);

app.listen(3000, () => console.log("Server started: Listening at port 3000"));