const express = require('express');
const app = express();
// Parse http requests with content-type multipart/for-data, also known as file uploads.
const multiparty = require('multiparty');
const format = require('util').format;

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('form');
});	

app.post('/', function(req, res, next) {
	// create a form to begin parsing
	const form = new multiparty.Form();
	let image;
	let title;

	form.on('error', next);
	form.on('close', function() {
		res.send(format(`\nuploaded ${image.filename} (${image.size / 1024 | 0} kb) as ${title}`));
	});

	// listen on field event for title
	form.on('field', function(name, val) {
		if(name !== 'title') return;
		title = val;
	});

	// listen on part event for image file 
	form.on('part', function(part) {
		if(!part.filename) return;
		if(part.name !== 'image') return part.resume();
		image = {};
		image.filename = part.filename;
		image.size = 0;
		part.on('data', function(buf) {
			image.size += buf.length;
		});
	});

	// parser the form 
	form.parse(req);
});


app.listen(3000, () => console.log("Server started: Listening at port 3000"));