var express = require('express')
	, routes = require('./routes');

var app = module.exports = express();

app.get('/bootstrap', routes.bootstrap);
app.get('/:collection/:id', routes.show);
app.get('/:collection', routes.list);
app.post('/:collection', routes.create);
app.put('/:collection/:id', routes.update);
app.del('/:collection/:id', routes.destroy);
