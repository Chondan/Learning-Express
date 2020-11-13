const express = require('express');
const app = express();
const { html, text, json } = require('./users.js');

console.log(text);

// so either you can deal with different typs of formatting
// for expected response in index.js
app.get('/', function(req, res) {
	res.format({
	  text,
	  html,
	  json: json(req, res)
	});
});

// or you could write a tiny middleware like
// this to add a layer of abstraction
// and make things a bit more declarative:

function format(path) {
	const obj = require(path);
	return function(req, res) {
		res.format(obj);
	}
}

app.get('/users', format('./users'));

app.listen(3000, () => console.log("Server started: Listening at port 3000"));