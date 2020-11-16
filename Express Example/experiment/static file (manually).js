const express = require('express');
const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/index.js', function(req, res) {
	res.sendFile(__dirname + '/index.js');
});

app.listen(3000, () => console.log("Server started: Listening at port 3000"));