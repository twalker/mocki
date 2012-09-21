/* 
	attaches generic collection routes to the consuming app.
*/
var express = require('express')
	, routes = require('./routes');

module.exports = function(mockspath){
	var app = express();
	app.get('/bootstrap', routes.bootstrap);
	app.get('/:collection/:id', routes.show);
	app.get('/:collection', routes.list);
	app.post('/:collection', routes.create);
	app.put('/:collection/:id', routes.update);
	app.del('/:collection/:id', routes.destroy);
	// support mounted app by setting as the export
	return app;
};