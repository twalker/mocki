var http = require('http'),
	express = require('express'),
	path = require('path'),
	mocki = require('./routes/mocki');

var app = express();

app
	.set('port', process.env.PORT || 8000)
	.set('host', process.env.HOST || 'localhost');

app
	.use(express.favicon())
	.use(express.logger('dev'))
	.use(express.bodyParser())
	.use(app.router)
	.use('/api', mocki(path.join(__dirname, 'mocks'))) // mount mocks at /api
	.use(express.errorHandler({showStack: true, dumpExceptions: true}));

http.createServer(app).listen(app.get('port'), function(){
	console.log("client app listening at: http://" + app.get('host') + ":" + app.get('port'));
	console.log("mock routes mounted on /api");
});
