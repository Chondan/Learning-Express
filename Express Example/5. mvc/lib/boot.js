const fs = require('fs');
const path = require('path');
const express = require('express');

const boot = function(app, options) {
	const dir = path.join(__dirname, '..', 'controllers');
	const controllers = fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isDirectory());
	controllers.forEach(controller => {
		const obj = require(path.join(__dirname, '..', 'controllers', controller));

		const objInfo = [ "name", "engine", "prefix", "before" ];
		const prefix = obj.prefix || '';
		const name = obj.name || controller;
		const engine = obj.engine;

		const route = Object.keys(obj).filter(key => !objInfo.includes(key));

		route.forEach(handler => {
			let method;
			let url;
			switch (handler) {
				case "list":
					method = "get";
					url = `/${controller}s`;
					break;
				case "show":
					method = "get";
					url = `/${controller}/:${controller}Id`;
					break;
				default:
					throw new Error('Unrecognized route: ' + name + '.' + handler);
					break;
			}

			if(obj.engine) {
				app.set('views', path.join(__dirname, '..', 'controllers', controller, 'views'));
				app.set('view engine', engine);
			}

			console.log(`url: ${url}, method: ${method}`);
			if(obj.before) {
				app[method](url, obj.before, obj[handler]);
			} else {
				app[method](url, obj[handler]);
			}
		});
	});
}

module.exports = boot;