const express = require('express');
const app = express();

// create an error with .status
// we can then use the property in our 
// custom error handler (connect respects this prop as well)
function error(status, msg) {
	const err = new Error(msg);
	err.status = status;
	return err;
}

// if we want to supply more than JSON, we could use something similar to the content-negotiation example

// here we validate the API key, by mounting this middleware to /api
// meaning only paths prefixed with '/api' will cause this middleware to be invoked
app.use('/api', function(req, res, next) {
	const key = req.query['api-key'];

	// key isn't present
	if(!key) return next(error(400, 'api key required'));

	// key is invalid
	if(!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key')); // ~(-1) = 0, so !0 is true

	// all good, store req.key for route access
	req.key = key;
	next();
});

// map of valid api keys, typically mapped to account info with some sort of database like redis.
// api keys do not serve as authentication, merely to track API usage or help prevent malicious behavior etc.
const apiKeys = ['foo', 'bar', 'baz'];

// these two objects will serve as our faux database
const repos = [
	{ name: 'express', url: 'https://github.com/expressjs/express' },
	{ name: 'stylus', url: 'https://github.com/learnboost/stylus' }
];
const users = [
	{ name: 'tobi' }, { name: 'loki' }, { name: 'jane' }
];
const userRepos = {
	tobi: [repos[0], repos[1]], loki: [repos[1]], jane: [repos[0]]
};

// we now can assume the api key is valid and simply expose the data

// example: http://localhost:3000/api/users/?api-key=foo
app.get('/api/users', function(req, res, next) {
	res.send(users);
});

// example: http://localhost:3000/api/repos/?api-key=foo
app.get('/api/user/:name/repos', function(req, res, next) {
	const { name } = req.params;
	const user = userRepos[name];

	if(user) res.send(user);
	else next();
});

// middleware with an arity of 4 are considered 
// error handlin middleware. when you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring regular middleware.
app.use(function(err, req, res, next) {
	// whatever you want here, feel free to populate
	// properties on `err` to treat it differently in here.
	res.status(err.status || 500);
	res.send({ error: err.message });
});

// our custom JSON 404 middleware. Since it's placed last it will be the last middleware called, 
// if all others invoke next() and do not respond.
app.use(function(req, res) {
	res.status(404);
	res.send({ error: "Lame, can't find that" });
});

app.get('/', function(req, res) {
	res.end("Hello World");
});

app.listen(3000, () => console.log("Server started: Listening at port 3000"));