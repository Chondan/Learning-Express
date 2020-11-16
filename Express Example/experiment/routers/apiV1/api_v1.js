const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
	res.send("API V1");
});

module.exports = router;