const users = require('./db');

const html = function(req, res) {
	res.send('<ul>' + users.map(user => {
		return `<li>${user.name}</li>`;
	}).join('') + '</ul>');
};

const text = function(req, res) {
	res.send(users.map(user => {
		return ` - ${user.name}\n`;
	}).join(''));
};

// const json = function(req, res) {
// 	res.json(users);
// };

const json = (req, res) => {
	return (req, res) => {
		res.json(users);
	}
}

module.exports = { html, text, json };