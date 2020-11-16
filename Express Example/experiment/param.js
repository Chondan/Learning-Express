const express = require('express');
const app = express();

app.param('name', function(req, res, next, value, name) {
	// try to get the user details from the User model and attach it to the request object
	console.log(value, name);
	next();
});

// Add callback trigger to route parameters
app.param([ 'id', 'page' ], function(req, res, next, value, name) {
	console.log(`${name}: ${value}`);
	next();
});

app.get('/user/:id', function(req, res) {
	res.end("USER ID: " + req.params.id);
});

app.get('/user/:id/:page', function(req, res) {
	res.end(`ID: ${req.params.id}, PAGE: ${req.params.page}`);
});

app.get('/', function(req, res) {
	res.end("Hello world");
});


app.set('views', './views');
app.set('view engine', 'ejs');

app.listen(3000, () => console.log("Server started: Listening at port 3000"));