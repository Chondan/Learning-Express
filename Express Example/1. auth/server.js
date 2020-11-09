const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();

// REDIS
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client = redis.createClient();

// Initialize the session 
app.use(session({ 
	secret: 'ssshhhhh', 
	saveUninitialized: true, // don't create session until something stored
	resave: true, // don't save session if unmodified
	store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260 })
	// ttl is stands for (time-to-live) This introspection capability allows a Redis client to check how many seconds a given key will continue to be part of the dataset.
}));

// Set view engine
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));
app.use(express.static(__dirname + '/views'));

router.get('/', (req, res) => {
	let sess = req.session;
	if(sess.email) {
		return res.redirect('/admin');
	}
	res.sendFile(__dirname + '/index.html');
});

router.post('/login', (req, res) => {
	req.session.email = req.body.email;
	res.end('done');
});

router.get('/admin', (req, res) => {
	console.log(req.session);
	if(req.session.email) {
		res.write(`<h1>Hello ${req.session.email}</h1><br>`);
		res.end('<a href=' + '/logout' + '>Logout</a>');
	} else {
		res.write('<h1>Please login first.</h1>');
		res.end('<a href=' + '/' + '>Login</a>');
	}
});

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if(err) {
			return console.error(err);
		}
		res.redirect('/');
	});
});

app.get('/test', function(req, res) {
	res.locals = { name: "Chondan", age: 22 };
	res.render('test.ejs');
});

app.use('/', router);

app.listen(3000, () => console.log("Server started: Listening at port 3000"));