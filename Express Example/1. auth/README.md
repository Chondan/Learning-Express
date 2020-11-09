# How to manage Session using Node.js and Express

## Learning Stuffs[
- [TTL (time-to-live)](https://searchnetworking.techtarget.com/definition/time-to-live#:~:text=Time%2Dto%2Dlive%20(TTL)%20is%20a%20value%20in,long%20and%20should%20be%20discarded.)
- hash and salt password
	- Adding Salt to Hashing: A Better Way to Store Passwords
- password is compromised?
- ER Diagram
	- Links
		- https://www.guru99.com/er-diagram-tutorial-dbms.html
		- https://www.slideshare.net/IngePowell/erd-optionality
	- cardinality and optionality
- Session Management in Nodejs Using Redis as Session Store
	- Redis
		- https://medium.com/@iamgique/what-redis-is-4381ff32880d
	- Redis is a key-value pair cache and store. it is also referred to as data structure server cause keys can contain List, Hash, sets, sorted sets, etc.
	- Redis is fast cause it work in memory data set i.e by default stores data in your memory that disk and if you from CS background you very well know CRUD operaion on memory is way faster that disk, so is Redis.
- Session in Nodejs
- Adding Salt to Hashing: A Better Way to Store Passwords
- Session Management
	- https://redislabs.com/solutions/use-case/session-management/
- Cache vs. Session Store
	- https://redislabs.com/blog/cache-vs-session-store/

### Session
- https://github.com/expresjs.session

### Redis

`sudo apt-get install redis-server`

Command
- https://redis.io/commands/

Basic REDIS command
- Starting Redis server -> `redis-server &`
- Open Redis CLI tool -> `redis-cli`
- List all keys -> `KEYS *`
- Retrieve information regarding particular key -> `GET <key name>`
- set [key] [value] -> `set foo bar`
- get [key] -> `get foo` 
- `flushall` -> clear all of datas
- delete key -> `del [key]`

Store data
- String -> `set [key] [value]` `get [key]`
- List
	- commands -> LPUSH, RPUSH, LRANGE, LINDEX, LLEN
- Set 
	- SADD, SMEMBERS
- Hashes (Store value as "key"-"value")
	- commands -> HSET, HMSET, HGET, HGETALL

### systemctl
- https://www.liquidweb.com/kb/what-is-systemctl-an-in-depth-overview/

---

## Manage Session using Node.js and Express

Session handling in any web application is very important and is a must-have feature, without it, we won't be able to track user and it's activity.

`npm install expres express-session body-parser`

Initialize the sessions

`app.use(session({ scret: 'ssshhhhh' }));`

- Here 'secret' is used for cookie handling etc but we have to put some secret for managing Session in Express.

> Note: It's similar to PHP Sessions (A session is a way to store information (in variables) to be used across multiple pages. Unlike a cookie, the information is not stored on the users computer.)

Now using 'request' variable you can assign session to any variable. Just like we do in PHP using `$_SESSION` variable. for e.g.

```JavaScript
let sess;
app.get('/', function(req, res) {
	sess = req.session;
	// Here we have assigned the 'session' to 'sess'
	// Now we can create any number of session variables we want.
	// in PHP we do as $_SESSION['var name']
	// *Here we do like this.

	sess.email; // equivalent to $_SESSION['email'] in PHP.
	sess.username; // equivalent to $_SESSION['username'] in PHP.
});
```

After creating Session variables like sess.email, we can check wheter this variable is set or not in other routers and can track the Session easily.

> Note: Tracking session in global variable won't work with multiple users. This is just for the demonstration.

## The Bug Alert!
As I have mention earlier, using a global variable for the session won't work for multiple users. You will receive the same session information for all of the users.

So how do we solve this? By using a session store.

We save every session in the store so that one session will belong to one user only. 

For a quick reference, here is how we can extend the code shown above using Redis as a session store.

```JavaScript
// REDIS
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client = redis.createClient();

// Initialize the session 
app.use(session({ 
	secret: 'ssshhhhh', 
	saveUninitialized: true, // don't create session until something stored
	resave: true, // don't save session if unmodified
	store: new redisStore({ host: 'localhost', port: 6379, client: client, ttl: 260 })
	// ttl is stands for (time-to-live) This introspection capability allows a Redis client to check how many seconds a given key will continue to be part of the dataset.
}));
```

---

