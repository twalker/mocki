var http = require('http'),
  express = require('express'),
  mocki = require('./routes/mocki');

var app = module.exports = express();

app
  .set('port', process.env.PORT || 8000)
  .set('host', process.env.HOST || 'localhost');

app
  .use(express.favicon())
  .use(express.logger('dev'))
  .use(app.router)
  .use('/api', mocki()) // mocki mount at /api
  .use(express.errorHandler({showStack: true, dumpExceptions: true}));

http.createServer(app).listen(app.get('port'), function(){
  console.log('mocki mounted at: http://' + app.get('host') + ':' + app.get('port') + '/api');
});
