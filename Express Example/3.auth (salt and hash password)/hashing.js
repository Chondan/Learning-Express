const bkfd2Password = require("pbkdf2-password");
const hasher = bkfd2Password();

const obj = {
	password: '1234'
};

hasher(obj, function(err, pass, salt, hash) {
	console.log("pass: ", pass);
	console.log("salt: ", salt);
	console.log("hash: ", hash);
	obj.salt = salt;
	hasher(obj, function(err, pass, salt, hash) {
		console.log("pass: ", pass);
		console.log("salt: ", salt);
		console.log("hash: ", hash);	
	});
});