const engine = 'ejs';
const { users } = require('../../db');

const before = function(req, res, next) {
	console.log("Hi from user controller");
	next();
}

const list = function(req, res) {
	res.json(users);
}

const show = function(req, res) {
	const { userId } = req.params;
	res.json(users.find(user => user.id === Number(userId)));
}

module.exports = { engine, before, list, show };