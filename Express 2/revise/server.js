const express = require('express');
const app = express();
const todo = require('./controllers/todoController');
const birds = require('./routers/birds');

// VIEW ENGINE 
app.set('views', './files'); // SET PATH
app.set('view engine', 'ejs'); // SET TEMPLATE

// MIDDLEWARE 
app.use('/', function(req, res, next) {
	console.log(`requested ${req.url} with ${req.method} method`);
	next();
});

// MULTIPLE METHOD BUT REQUIRE next()
app.get('/test', function(req, res, next) {
	next();
});
app.get('/test', function(req, res) {
	res.send('testt');
});

app.get('/about', function(req, res) {
	res.status(200).render('about', { name: "Chondan" });
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});
app.use(function(req, res, next) {
	if (req.url == "/" || req.url == "/home") {
		res.redirect('/');
	}
});

// ROUTER
app.route('/book/:bookId')
	.get(function(req, res) {
		const { bookId } = req.params;
		res.send(`Get a book no ${bookId}`);
	})
	.post(function(req, res) {
		const { bookId } = req.params;
		res.send(`Add a book no ${bookId}`);
	});

// CONTROLLER
todo(app);

// ROUTER
app.use('/birds', birds);

app.get('/tel/:telNo(\\d{10})', function(req, res) {
	res.send(req.url);
});


app.get('*', function(req, res) {
	res.redirect("back");
});

app.listen(3000, () => console.log("Server started: Listening at port 3000"));