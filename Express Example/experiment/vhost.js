const express = require('express');
const app = express();
const vhost = require('vhost');

app.set('views', './views');
app.set('view engine', 'ejs');

// CORS
app.use('/', function(req, res, next) {
	console.log("HI");
	res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE,GET,PATCH,POST,PUT',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization'
    });
    console.log(req);
	next();
});

// vhost(hostname, handle)
// Creat a new middleware function to hand off request to 'handle' when the 
// incoming host for the request mathes 'hostname'. 
const main = express();
main.use(function(req, res, next) {
	console.log(req.vhost);
	next();
});
app.use(vhost('example.com', main));

app.get('/', function(req, res) {
	res.end(`Hello, ${req.hostname}`);
});

app.listen(3000, () => console.log("Server started: Listening at port 3000"));