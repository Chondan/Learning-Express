const express = require('express');
const app = express();
const session = require('express-session');

app.use(function(req, res, next) {
	if(req.url === '/error') {
		return next(new Error("Error"));
	}
	next();
});

app.get('/', function(req, res) {
	res.end("Hello World");
});

// CONTROLLERS
const boot = require('./lib/boot.js');
boot(app, null);

app.use(function(err, req, res, next) {
	res.end("Internal server error");
});;

app.use(function(req, res, next) {
	res.status(404).end("404 Page Not Found");
});


app.listen(3000, () => console.log("Server started: Listening at port 3000"));

