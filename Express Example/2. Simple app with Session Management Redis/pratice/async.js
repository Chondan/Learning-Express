const async = require('async');

function test(callback) {
	async.waterfall([
		function(callback) {
			callback(null, "Chondan", 22);
		},
		function(name, age, callback) {
			console.log(`Hi, My name is ${name}`);
			callback(true);
		}

	], function(err, result) {
		if (err) {
			callback(err);
		}

	});
}

test(err => console.log("Hello world", err));