const bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

let todos = [];

function todoController(app) {
	app.get('/todo', function(req, res) {
		res.render('todo.ejs', { data: todos });
	});

	app.post('/todo', urlencodedParser, function(req, res) {
		todos.push(req.body);
		res.json(req.body);
	});

	app.delete('/todo', urlencodedParser, function(req, res) {
		console.log(req.body);
		const { id } = req.body;
		todos = todos.filter(todo => todo.id !== id);
		res.json(req.body);
	});

	app.get('/todo/:id', function(req, res) {
		const { id } = req.params;
		const todo = todos.find(todo => todo.id === id);
		res.send(`Item: ${todo.item}, Id: ${id}`);
	});
}

module.exports = { todoController };