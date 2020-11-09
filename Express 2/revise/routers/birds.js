const express = require('express');
const router = express.Router();

router.use(function(req, res, next) {
	console.log(`Request at ${new Date(Date.now()).toISOString()}`);
	next();
});

router.get('/', function(req, res) {
	res.send("This is bird home page");
});

router.get('/about', function(req, res) {
	res.send("This is brid about page");
});

module.exports = router;