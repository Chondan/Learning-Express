const mysql = require('mysql');
const connection = mysql.createConnection({
	host: '192.168.1.39',
	user: 'chondan',
	password: '68083524chondan',
	database: 'chondan'
});

connection.connect();

connection.query('SELECT * FROM user', function(error, results, fields) {
	if (error) throw error;
	console.log(results);
});

connection.end();