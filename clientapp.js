var express = require('express')
	, http = require('http');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 8000);
	app.set('host', process.env.HOST || 'localhost');

	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use('/api', require('./mountedapp'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	
	app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
});


http.createServer(app).listen(app.get('port'), function(){
	console.log("client listening at: http://" + app.get('host') + ":" + app.get('port'));
});
