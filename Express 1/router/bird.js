const express = require('express');
const router = express.Router();

router.use(function(req, res, next) {
	console.log("Request time: ", new Date(Date.now()).toISOString());
	req.name = "BIRDS"; // edit request object by adding some property
	next();
});

router.get('/', function(req, res) {
	res.send("Bird's home page " + req.name);
});

router.get('/about', function(req, res) {
	res.send("Bird's about page");
});

module.exports = router;