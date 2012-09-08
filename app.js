
/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, path = require('path')
	, url = require('url');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 8000);
	app.set('host', process.env.HOST || 'localhost');
	//app.set('views', __dirname + '/views');
	//app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'mocks')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/:collection', routes.list);
app.get('/:collection/:id', routes.show);
app.post('/:collection', routes.create);

app.put('/:collection/:id', routes.update);
app.del('/:collection/:id', routes.del);

http.createServer(app).listen(app.get('port'), function(){
	console.log("mocki listening at: http://" + app.get('host') + ":" + app.get('port'));
});
