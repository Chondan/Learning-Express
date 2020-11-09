# Node.js Express

## Serving static files in Express
To serve static files such as images, css files, and javaScript files, use the `express.static` built-in middleware function in Express.

The function signature is:
`express.static(root, [options])`

The *root* argument specifies the root directory from which to serve static assets.

For example, use the following code to serve images, CSS files, and JavaScript files in a directory name `public`:

```JavaScript
app.use(express.static('public'));
```

Now, you can load the files that are in the `pulice` directory:

```
http://localhost:3000/images/kitten.jgp
```

> Express looks up the files relative to the static directory, so the name of the static directory is not part of the URL.

To use multiple static assets directories, call the `express.static` middleware function multiple times:

```JavaScript
app.use(express.static('./public'));
app.use(express.static('./files'));
```

Express looks up the files in the order in which you set the static directories with the `express.static` middleware function.

> NOTE: For best results, **use a reverse proxy** cache to improve performance of serving static assets.

To create a virtual path prefix (where the path does not actually exist in the file system) for files that are served by the `express.static` function, **specify a mount path** for the static directory, as shown below:

```JavaScript
app.use('/static', express.static('./public'));
```

Now, you can load the files that are in the `public` directory from the `/static` path prefix.

```
http://localhost:3000/static/images/kitten.jpg
```

However, the path that you provide to the `express.static` function is relative to the directory from where you launch your `node` process. If you run the express app from another directory, it's safer to use the absolute path of the directory that you want to serve:

```JavaScript
const path = require('path');
app.use('/static', express.static(path.join(__dirname, 'public')));
```

---


## Routing
**Routing** refers to how an application's endpoints (URIs) respond to client requests.

- You define routing using methods of the Express `app` object that correspond to HTTP methods; for example, `app.get()` to handle GET requrests and `app.post()` to handle POST requests.
- You can also use `app.all()` to handle all HTTP methods and `app.use()` to specify middleware as the callback function.

These routing methods specify a callback function (sometimes called "handler functions") called when the application receives a request to the specified route (endpoint) and HTTP method.

In other words, the application "listens" for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function.

In fact, the routing methods can have more than one callback function as arguments. With multiple callback functions, it is important to provide `next` as an argument to the callback function and then call `next()` within the body of the function to hand off control to the next callback.

### Route paths
Route paths, in combination with a request method, define the endpoints at which requests can be made. 

> Route paths can be strings, string patterns, or regular expressions.

The characters `?, +, *, and ()` are subsets of their regular expression counterparts. 

The hyphen `(-)` and teh dot `(.)` are interpreted literally by string-based paths.

If you need to use the dollar character `($)` in a path string, enclose it escaped within `([ and ])`. For example, the path string for requests at `"/data/$book"`, would be `"/data/([\$])book"`.

> Note!: Query strings are not part of the route path.

Example: Route path based on string patters
- '/ab?cd'
- '/ab+cd'
- '/ab\*cd' -> match abcd, abxcd, abRANDOMcd, abq23cd
- '/ab(cd)?e'
- '/\*' -> match everything

Example: Route path based on regular expressions
- `/a/` -> match anything with an 'a' in it.
- `/.*fly$/` -> match anything thet end up with 'fly'

### Route parameters
Route parameters are named URL segments that are used to capture the values specified at their position in the URL. The captured values are populated in the `req.params` object, with the name of the route parameter specified in the path as their respective keys.

```
Route path: /user/:userID/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": 34, "bookId": 8989 }
```

Since the hyphen `(-)` and the dot `(.)` are interpreted literally, they can be used along with route parameters for useful purpose.

```
Route path: /flight/:from-:to
Request URL: http://localhost:3000/flights/LAX-SFO
req.params: { "from": "LAX", "to": "SFO" }

Route path: /plantae/:genus.:species
Request URL: http://localhost:3000/plantae/Prunus.persica
req.params: { "genus": "Prunus", "species": "persica" }
```

To have more control over the exact string that can be matched by a route parameter, you can append a regular expression in parentheses`(())`:

```
Route path: /user/:userId(\d+)
Request URL: http://localhost:3000/user/42
req.params: { "userId": "42" }
```

> Because the regular expression is usually part of a literal string, be sure to escape any `\` characters with an additional backslash, for example `\\d+`.

### Route handlers
You can provide multiple callback functions that behave like *middleware* to handle a request. The only exception is that these callback invoke **`next('route')`** to bypass the remaining route callbacks. You can use this mechanism to impose pre-conditions on a route, then pass control to subsequent routes if there's no reason to proced with the current route.

- More than one callback function can handle a route (make sure you specify the *next* object)
- An array of callback functions can handle a route
- A combination of independent functions and arrays of functions can handle a route

```JavaScript
app.get('/example/d', [cb0, cb1], function(req, res, next) {
	console.log("The response will be sent by the next function...");
	next();
}, function(req, res) {
	res.send("Hello from D!");
})
```

### Response methods
The methods on the response object(res) in the following list can send a response to the client, and terminate the request-response cycle. If none of these methods are called from a route handler, the client request will be left hanging.

- res.download() -> Prompt a file to be download
- res.end() -> End the response process
- res.json() -> Send a JSON response
- res.jsonp() -> Send a JSON response with JSONP support
- res.redirect() -> Redirect a request

### app.route()
You can create chainable route handlers for a route path by using `app.route()`. Because the path is specified at a single location, creating modular routes is helpful, as is reducing redundancy and typos. 

```JavaScript
app.route('/book')
	.get(function(req, res) {
		res.send("Get a random book");
	})
	.post(function(req, res) {
		res.send("Add a book");
	});
```

### express.Router
Use the `express.Router` class to create modular, mountable route handlers. A `Router` instance is a complete middleware and routing system; for this reason, it is often referred to as a "mini-app".

At birds.js

```JavaScript
const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
	console.log("Time: ", new Date(Date.now()).toISOString());
	next();
});

// define the home page route
router.get('/', function(req, res) {
	res.send("Birds home page");
});

// define the about route
router.get('/about', function(req, res) {
	res.send("About birds");
});

module.exports = router;
```

At app.js

```JavaScript
const birds = require('birds');
app.use('/birds', birds);
```

The app will now be able to handle requests to `/birds` and `/birds/about`, as well as call the `timeLog` middleware function that is specific to the route.

---

## Writing Middleware

### Overview
**Midlleware** functions are functions that have access to the request object `(req)`, the response object `(res)`, and the `next` function in the application's request-response cycle.

The `next` function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.

Middleware functions can perform the following tasks:
- Execute any code
- Make changes to the request and the response objects
- End the request-response cycle
- Call the next middleware in the stack

If the current middleware function does not end the request-response cycle, it must call `next()` to pass control to the next middleware function. Otherwise, the request will be left hanging.

Example

```JavaScript
const express = require('express');
const app = express();

const myLogger = function(req, res, next) {
	console.log("Logged");
	next();
}

app.use(myLogger);

app.get('/', function(req, res) {
	res.send("Hello World!");
});

app.listen(3000);
```

Every time the app receives a request, it prints the message "LOGGED" to the terminal.

The order of middleware loading is important: middleware functions that are loaded first are also executed first.

If `myLogger` is loaded after the route to the root path, the request never reaches it and app doesn't print "LOGGED", because the route handler of the root path terminates the request-response cycle.

### Configurable middleware
If you need your middleware to be configurable, export a function which accepts an options object or other parameters, which then returns the middleware implementation based on the input parameter

```JavaScript
module.exports = function(options) {
	return function(req, res, next) {
		// Implement the middleware function based on the option object
		next();
	}
}
```

The middleware can now be used as shown below

```JavaScript
const mw = require('./my-middleware.js');
app.use(mw({ option1: '1', option2: '2' }));
```

---

## Using middleware
Express is a routing and middleware web framework that has minimal functionality of its own: An Express application is essentially a series of middleware function calls.

An Express application can use the following types of middleware:
- Application-level middleware
- Router-level middleware
- Error-handling middleware
- Built-in middleware
- Third-party middleware

You can load application-level and router-level middleware with an optional mount path. You can also load a series of middleware functions together, hich creates a sub-stack of the middleware system at a mount point.

### Application-level middleware
Bind application middleware to an instance of the *app object* by using the `app.use()` and `app.METHOD()` functions, where `METHOD` is the `HTTP` method of the request that the middleware function handles (such as GET, PUT, or POST) in lowercase.

This example shows a middleware function with no mount path. The function is executed every time the app receives a request.

```JavaScript
const express = require('express');
const app = express();

app.use(function(req, res, next) {
	console.log("Time: ", Date.now());
	next();
});
```

This example shows a middleware function mounted on the `/user/:id` path. The function is executed for any type of HTTP request on the `/user/:id` path.

```JavaScript
app.use('/user/:id', function(req, res, next) {
	console.log("Request Type: ", req.method);
	next();
});
```

This example shows a route and its handler function (middleware system). The function handles GET requests to the `/user/:id` path.

```JavaScript
app.get('/user/:id', function(req, res, next) {
	res.send("user");
});
```

Here is an example of loading a series of middleware functions at a mount point, with a mount path. It illustrates a middleware sub-stack that prints request info for any type of HTTP request to the `/user/:id` path.

```JavaScript
app.use('/user/:id', function(req, res, next) {
	console.log("Request URL: ", req.originalUrl);
	next();
}, function(req, res, next) {
	console.log("Request Type: ", req.method);
	next();
});
```

> req.originalUrl (the whole request path include with mounted path) VS. req.url (the request path not include mounted path)

```JavaScript

const requestUrl = "https://localhost:3000/book/21080412";

app.use('/book/:id', function(req, res, next) {
	console.log(req.originalUrl); // '/book/21080412'
	console.log(req.url); // '/'
	next();
});
```

Route handlers enable you to define multiple routes for a path. The example below difines two routes for GET requests to the `/user/:id` path. The second route will not cause any problems, but it will never get called because the first route ends the request-response cycle.

```JavaScript
app.get('/user/:id', function(req, res, next) {
	console.log("ID: ", req.params.id);
	next();
}, function(req, res, next) {
	res.send("User Info"); // ends the request-response cycle here
});
// handler for the /user/:id path, which prints the userID
app.get('/user/:id', function(req, res, next) {
	res.end(req.params.id);
});
```

To skip the rest of the middleware functions from a router middleware stack, call `next('route')` to pass control to the next route.

> **NOTE:** `next('route')` will work only in middleware functions that were loaded by using the `app.METHOD()` or `router.METHOD()` functions.

```JavaScript
app.get('/user/:id', function(req, res, next) {
	if (req.params.id === '0') {
		next('route');
	} else {
		next();
	}
}, function(req, res, next) {
	res.send("regular user");
});

app.get('/user/:id', function(req, res, next) {
	res.send("special user");
});
```

Middleware can also be declared in an array for reusability.

This example shows an array with a middleware sub-stack that handlers GET requests to the `/user/:id` path

```JavaScript
function logOriginalUrl(req, res, next) {
	console.log("Request URL: ", req.originalUrl);
	next();
}
function logMethod(req, res, next) {
	console.log("Request method: ", req.method);
	next();
}
const logStuff = [logOriginalUrl, logMethod];
app.get('/user/:id', logStuff, function(req, res, next) {
	res.send("User Info");
});
```

### Router-level middleware
Router-level middleware works in the same way as application-level middleware, excepts it is bound to an instance of `express.Router()`.

### Eror-handling middleware

> Error-handling middleware always takes **four** arguments. You must provide four arguments to indentify it as an error-handling middleware function. Even if you don't need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middlewares and will fail to handle errors.

Define error-handling middleware functions in the same way as other middleware functions, except with four arguments instead of three, specifically with signature `(err, req, res, next)`:

```JavaScript
app.use(function(err, req, res, next) {
	console.log(err.stack);
	res.status(500).send("Something broke!");
});
```

### Built-in middleware
Express has the following built-in middleware functions:
- `express.static` servers static assets such as HTML files, images, and so on.
- `express.json` parses incoming requests with JSON payloads. **NOTE: Available with Express 4.16.0+**
- `express.urlencoded` parses incoming requests with URL-encoded payloads. **NOTE: Available with Express 4.16.0+**

### Third-parth middleware
Use third-parth middleware to add functionality to Express apps.

The following example illustrates installing and loading the cookie-parsing middleware function `cookie-parser.`

```JavaScript
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

// load the cookie-parsing middleware
app.use(cookieParser());
```

--- 

## Overriding the Express API
The Express API consists of various methods and properties on the request and response objects. These are inherited by prototype. There are two extensino points for the Express API:

1. The global prototypes at `express.request` and `express.resonse`
2. App-specific prototypes at `app.request` and `app.response`

Altering the global prototypes will affect all loaded Express apps in the same process. If desired, alteratinos can be made app-specific by only altering the app-specific prototypes after creating a new app.

### Methods
You can override the signature and behavior of existing methods with your own, by assigning a custom function. Following is an example of overriding the behavior of `res.sendStatus`.

```JavaScript
app.response.sendStatus = function(statusCode, type, message) {
	// code is intentionally keps simple for demonstration purpose
	return this.contentType(type)
		.status(statusCode)
		.send(message);
};
```

The above implementation completely changes the original signature of res.sendStatus. It now accepts a status code, encoding type, and the message to be sent to the client.

The overridden method may now be used this way:

```JavaScript
res.sendStatus(404, "application/json", "{'error': 'resource not found'}");
```

--- 

## Using template engines with Express
A ***template engine*** enables you to use static template files in your application. At runtime, the template engine replaces variables in a template file with actual values, and transforms the template into an HTML file sent to the client. This approach makes it easier to design an HTML page.

To render template files, set the following `application setting properties`, set in `app.js` in the default app created by the generator:
- `views`, the directory where the template files are located. Eg: `app.set('views', './views')`. This defaults to the `views` directory in the application root directory.
- `view engine`, the template engine to use. For example, to use the Put template engine: `app.set('view engine', 'pug')`.

Then create a route to render the `index.pug` file. If the view `engine` property is not set, you must specify the extension of the `view` file. Otherwist, you can omit it.

```JavaScript
app.get('/', function(req, res) {
	res.render('index', { title: 'Hey', message: 'Hello there!' });
});
```

When you make a request to the home page, the `index.pug` file will be rendered as HTML.

---

