# Session Management in Nodejs Using Redis as Session Store

## SET UP
- add database information in 'sample.env' and rename it to '.env'

---

## Learning Stuffs
- Connection Pool
	- A **connection pool** is a *cache* of *database connections* maintained so that the connections can be reused when future requrests to the database are required. Connection pools are used to enhance the performance of executing commans on a database. Opening and manintaining a database connection for each user, especially requests made to a dynamic database-driven *website* application, is costly and wastes resources. In connection pooling, after a connection is created, it is placed in the pool and it is used again so that new connenction does not have to be established. If all the connections are being used, a new connection is made and is added to the pool. Connction pooling also cuts down on the amount of time a user must wait to establish a connection to the database.
- SSL

### Libraries
- async
	- DOCS: https://caolan.github.io/async/v3/
	- Async is a utility module which provides straight-forward, powerful functions for working with **asynchronous JavaScript**.
- cookie-parser
- mysql
- path
	- `var x = path.join('Users', 'Refsnes', '..', 'demo_path.js');` -> x = Users/demo_path.js

### async library

waterfall method

```JavaScript
async.waterfall([
	function(callback) {
		callback(null, "Chondan", 22);
	},
	function(name, age, callback) {
		console.log(`Hello, My name is ${name}. I am ${age} years old.`);
		callback(null, "bye");
	},
	function(msg) {
		console.log(msg);
	}
]);
```

### mysql
- Pooling connections
	- code flow: `pool.getConnection()` -> `connection.query()` -> `connection.release()`
	- use `connection.release()` when done with the connection to release it.

---

## CONCEPT

- LOGIN PAGE (login, register, checkemail) -> HOME PAGE (add status, Fetch status, show user_information, logout)

STORE USER_INFO IN MYSQL DATABASE
- when logged in -> retrieve data from database and store user_info on session (redis)
- when logged out -> destroy session

ROUTE
- / -> login, register
- /home -> show status, add status, log out
- /logout -> logout (destroy session)
- /register -> register
- /fetchStatus
- /addStatus
