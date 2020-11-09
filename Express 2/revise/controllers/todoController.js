const todoController = function(app) {

	app.get('/todo', function(req, res) {
		res.send("This is todo page");
	});

}

module.exports = todoController;