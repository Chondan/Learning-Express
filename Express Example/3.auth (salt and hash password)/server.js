const express = require('express');
const hash = require('pbkdf2-password')();
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

// CONFIG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extend: true }));
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: 'shhhh, very secret'
}));
app.use(express.static('./public'));

// DUMMY DATABASE
const users = {};

// When yuo create a user, generate a salt
// and hash the password ('foobar' is the pass here)
function hashing(username, password) {
	hash({ password: password }, function(err, pass, salt, hash) {
		if(err) throw err;
		// store the salt & hash in the "db"
		users[username] = {};
		users[username].username = username;
		users[username].salt = salt;
		users[username].hash = hash;
	});
}
function authenticate(username, password, callback) {
	if(!users[username]) {
		return callback(true);
	}
	hash({ password: password, salt: users[username].salt }, function(err, pass, salt, hash) {
		if(hash === users[username].hash) {
			callback(null, users[username]);
		} else {
			callback(true);
		}
	})
}

app.get('/', function(req, res) {
	res.render('index.ejs');
});

app.get('/register', function(req, res) {
	res.render('register.ejs');
});

app.post('/register', function(req, res) {
	const { username, password } = req.body;
	if(users[username]) {
		return res.end("This is username is already used");
	}
	hashing(username.toString(), password.toString());
	res.end("done");
});

app.post('/login', function(req, res) {
	const { username, password } = req.body;
	authenticate(username, password, function(err, user) {
		if(err) {
			return res.end("Wrong username or wrong password");
		}
		req.session.auth = user;
		res.end("done");
	});	
});

app.get('/home', function(req, res) {
	if(req.session.auth) {
		res.write(`<h1>Hello ${req.session.auth.username}, How are you doing?</h1>`);
		res.end(`<a href='logout'>Log out</a>`);
		return;
	}
	res.write(`<h1>Please Login First</h1>`);
	res.end(`<a href='/'>Go to Login</a>`);

});

app.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		if(err) throw err;
		res.redirect('/');
	});
});

if(!module.parent) {
	app.listen(3000, () => console.log("Server started: Listening at port 3000"));
}