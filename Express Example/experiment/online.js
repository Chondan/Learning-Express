const express = require('express');
const app = express();
let online = require('online');
const redis = require('redis');
const db = redis.createClient();

// online 
online = online(db);

// activity tracking, in the case using
// the UA string, you would use req.user.id etc
app.use(function(req, res, next) {
	// fire-and-forget
	online.add(req.headers['user-agent']);
	next();
});

function list(ids) {
	const list = ids.map(id => {
		return `<li>${id}</li>`;
	});
	return `<ul>${list.join('')}</ul>`;
}

app.get('/', function(req, res, next) {
	online.last(1, function(err, ids) {
		if(err) return next(err);
		res.send(`<p>Users online: ${ids.length}</p>` + list(ids));
	});
});

app.set('views', './views');
app.set('view engine', 'ejs');

app.listen(3000, () => console.log("Server started: Listening at port 3000"));