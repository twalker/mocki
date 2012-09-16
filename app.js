var express = require('express')
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, url = require('url');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 8000);
	app.set('host', process.env.HOST || 'localhost');

	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
});

app.get('/bootstrap', routes.bootstrap);
app.get('/:collection/:id', routes.show);
app.get('/:collection', routes.list);
app.post('/:collection', routes.create);
app.put('/:collection/:id', routes.update);
app.del('/:collection/:id', routes.destroy);


http.createServer(app).listen(app.get('port'), function(){
	console.log("😌  mocki listening at: http://" + app.get('host') + ":" + app.get('port'));
});
