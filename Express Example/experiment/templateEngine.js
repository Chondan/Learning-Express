const express = require('express');
const path = require('path');
const fs = require('fs');
const marked = require('marked');
const app = express();
const escapeHtml = require('escape-html');

const logger = require('morgan');
const silent = false;

// register .md as engine in express view system
app.engine('md', function(path, options, fn) {
	fs.readFile(path, 'utf-8', function(err, str) {
		console.log(str);
		if(err) return fn(err);
		// turn the string to html format
		const html = marked.parse(str).replace(/\{([^}]+)\}/g, function(_, name) {
			console.log(name);
			return escapeHtml(options[name] || '');
		});
		fn(null, html);
	});
});

app.engine('ejs', function(path, options, fn) {
	fs.readFile(path, 'utf-8', function(err, data) {
		if(err) return fn(err);
		const rendered = data.replace(/<%= ([\w]+) %>/g, function(matched, group) {
			return options[group];
		});
		console.log(rendered);
		fn(null, rendered);
	});
});


app.set('views', path.join(__dirname, 'views'));
// make it the default so we don't need .md
app.set('view engine', 'md');

app.get('/', function(req, res) {
	res.render('index', { title: 'Markdown Example' });
});

app.get('/test', function(req, res) {
	res.end(`<h1>Foo & Bar</h1>`);
});


app.listen(3000, () => console.log("Server started: Listening at port 3000"));