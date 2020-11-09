const express = require('express');
const { todoController } = require('./controllers/todoController/todoController');
const app = express();

// SET VIEW ENGINE
app.set('view engine', 'ejs');

// SET STATIC FILES
app.use('/public', express.static('./public'));

app.get('/', function(req, res) {
	res.render('index.ejs');
});

// todo controller
todoController(app);

app.listen(3000, function() {
	console.log("Server started: Listening at port 3000");
});