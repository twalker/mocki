## 😌  mocki
an little express server of mock json files for backbone models/collections. it's meant to be mounted by an existing
express app.

mocki serves json files in `test/fixtures/:collection`  

maybe someday mocki will grow up to be a grunt task, or accept handy options like a routes hash, or just provide actions...  or maybe remain a little simple script. 

mocki has less that 1/1000th the coolness of [nock](https://github.com/flatiron/nock), but I wanted persistence and to learn stuff. 

---------------

###routes

GET collection/:id?  

list: dynamically return an json array of each `*.json` file in dir.  
show: `id.json` file

POST collection/:id  
create/save an `id.json` file

PUT collection/:id  
update/save an `id.json` file and reflect back the json sent
	
DELETE collection/:id  
delete `id.json` file


---------------

### usage

to mount mocki, use him like middleware in a hosting express app:

		var http = require('http'),
				express = require('express'),
				mocki = require('./routes/mocki');
		//...
		app.use('/api', mocki()); // mount mocks at /api
		//...
		http.createServer(app).listen(app.get('port'), function(){
			console.log("mock routes mounted on /api");
		});

-----------------
### TODO

- write some unit tests using supertest
- create should create a collection dir if it doesn't exist
- double check error handling best practice
- clean up this mess of a readme

-----------------

### messy notes from mocki's adventures

in the client express app, forward proxy the desired requests, e.g. /api/*
		
		// proxy api requests to mocki when in "test" mode
		app.configure('test', function () {	
			var proxy = new httpProxy.RoutingProxy();
			app.set('trust proxy', true);
			app.all("/api/*", function(req, res){
				// trim urls for mocki, url should start with collection name
				req.url = req.url.replace(/^.+api\//, '/');
				proxy.proxyRequest(req, res, {
					host: 'localhost',
					port: 8000
				});
			});
		});


---------------

###big todo:

need to figure out how exactly I want to use it in app before I get too far. 
 I want to use it to swap out for the real restful resource api based on NODE_ENV.  
 Stand alone server or middleware?  
 If middleware, mocki I can use it per collection and let the routing be handled by the consuming app. mocki just responds, let the client determine which requests to forward.

####problems:

- same origin policy restricts to the same port that the client's using. should look into cors.
- when using a proxy in the client, express.bodyParser() changes the request to where http-proxy doesn't forward POST, DELETE, UPDATE requests properly [more info](https://github.com/nodejitsu/node-http-proxy/issues/180). The fix is to register the middleware before the bodyParser.

###smaller todo: 

- handle case of serving list.json.
- figure out how better way to deal with namespacing for 'api', should be an option.
- figure out how to deal with options (mock dir, base api path)
- better deal with throwing errors, especially for folder not found--need to understand best practice.