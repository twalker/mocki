var http = require('http'),
  express = require('express'),
  mocki = require('./routes/mocki');

var app = module.exports = express();

app
  .set('port', process.env.PORT || 8000)
  .set('host', process.env.HOST || 'localhost');

app
  .use(require('static-favicon')())
  .use(require('morgan')('dev'))
  .use('/api', mocki()) // mocki mount at /api
  .use(require('errorhandler')({ dumpExceptions: true, showStack: true }));

http.createServer(app).listen(app.get('port'), function(){
  console.log('mocki mounted at: http://' + app.get('host') + ':' + app.get('port') + '/api');
});
