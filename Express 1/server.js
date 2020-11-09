const express = require('express');
const path = require('path');
const app = express();
const birds = require('./router/bird');

// SET STATIC FILES
app.use('/pathA', express.static('./public'));
app.use('/pathB', express.static(path.join(__dirname, 'files')));

function middleware() {
	app.all('/', function(req, res, next) {
		console.log("Accessing the secret section...");
		next();
	});

	app.use('/', function(req, res, next) {
		console.log("use");
		next();
	});
}

const myName = name => {
	return (req, res, next) => {
		console.log(`Hello, My name is ${name}`);
		next();
	}
}

app.use(myName("Chondan"));

app.use(function(req, res, next) {
	console.log(`host: ${req.host}`);
	console.log(`ip: ${req.ip}`);
	console.log(`protocol: ${req.protocol}`);
	console.log(`secure: ${req.secure}`);
	console.log(`requested ${req.url}`);
	next();
});

app.get('/((home)?)',(req, res, next) => {
	console.log(req.url);
	next();
}, function(req, res) {
	res.sendFile('/index.html', { root: './' });
});

app.post('/', function(req, res) {
	res.json({ name: "Chondan" });
});

function regex() {
	app.get('/user/:userId/books/:bookId', function(req, res) {
		res.send(JSON.stringify(req.params));
	});

	app.get('/books/:bookId([a-z]{2,})', function(req, res) {
		res.send(JSON.stringify(req.params));
	});

	app.get('/user/:name/tel/:no([\\d]{10})', function(req, res) {
		res.send(JSON.stringify(req.params));
	});

	app.get('/tel/:no(\\d{10})', function(req, res) {
		res.send(JSON.stringify(req.params));
	});
}

function routeHandlers() {
	app.get('/example/a', function(req, res, next) {
		console.log("the response will be sent by the next function...");
		next();
	}, function(req, res) {
		res.send("Hello from A!");
	});

	// An array of callback functions can handle a route.
	const cb0 = (req, res, next) => {
		console.log("CB0");
		next();
	}
	const cb1 = (req, res, next) => {
		console.log("CB1");
		next();
	}
	const cb2 = (req, res) => {
		res.send("Hello from C!");
	}
	app.get('/example/c', [cb0, cb1, cb2]);
}

function responseMethods() {
	app.get('/user/:userId/download/note.txt', function(req, res) {
		const { userId } = req.params;
		if (userId === "1234") {
			res.download('./note.txt');
		} else {
			res.end("Sorry, wrong userId");
		}
	});

	app.get('/api', function(req, res) {
		const person = { name: "Chondan" };
		res.json(person);
	});
}

app.get('/status', function(req, res) {
	res.sendStatus(200);
});

function route() {
	app.route('/book')
		.get(function(req, res) {
			res.send("Get a random book");
		})
		.post(function(req, res) {
			res.set('Content-Type', 'text/plain').send("Add a book");
			// res.json({});
		})
}

app.use('/birds', birds);

// STACK OF MIDDLEWARE
app.use('/user/:id', function(req, res, next) {
	console.log("Request URL: ", req.originalUrl);
	console.log("Request path: ", req.url);
	next();
}, function(req, res, next) {
	console.log("Request method: ", req.method);
	next();
	console.log("BYE");
});
app.get('/user/:id', function(req, res) {
	res.send(`UserId: ${req.params.id}`);
});

app.get('/test', function(req, res, next) {
	console.log("middleware1");
	next('route');
	console.log("bye");
}, function(req, res, next) {
	console.log("middleware2");
	next();
});
app.get('/test', function(req, res) {
	res.append('Warning', '199 Miscellaneous warning');
	res.cookie('name', 'chondan');
	res.end("TEST");
});
app.get('/removeCookie', function(req, res) {
	res.clearCookie('name', { path: '/test' });
	res.end("TEST");
})

// REDIRECT TO THE HOME PAGE
app.get('*', function(req, res) {
	res.redirect('back');
});

app.listen(3000, () => {
	console.log("Server started: Listening at port 3000");
});