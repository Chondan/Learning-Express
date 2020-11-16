const express = require('express');
const app = express();
const path = require('path');
const redis = require('redis');
const db = redis.createClient();

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', './views');
app.set('view engine', 'ejs');

// pupulate search
db.sadd('ferret', 'tobi'); // set's name is 'ferret'
db.sadd('ferret', 'loki');
db.sadd('ferret', 'jane');
db.sadd('cat', 'manny'); // set's name is 'cat'
db.sadd('cat', 'luna');

// GET search for :query
app.get('/search/:query', function(req, res) {
	const { query } = req.params;
	db.smembers(query, function(err, value) {
		if(err) return res.send(500);
		res.send(value);
	});
});

app.listen(3000, () => console.log("Server started: Listening at port 3000"));