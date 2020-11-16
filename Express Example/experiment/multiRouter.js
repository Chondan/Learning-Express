const express = require('express');
const app = express();
const apiV1Router = require('./routers/apiV1/api_v1');

app.get('/', function(req, res) {
	res.send("Hello World");
});

app.use('/api/v1', apiV1Router);

app.listen(3000, () => console.log("Server started: Listening at port 3000"));