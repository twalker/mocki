## 😌  mocki
an little express server of mock json files for backbone models/collections. it's meant to be mounted by an existing
express app.

mocki serves json files in `test/fixtures/:collection` by default

maybe someday mocki will grow up to be a grunt task, or accept handy options like a routes hash, or just provide actions...  or maybe remain a little simple script. 

mocki has less that 1/1000th the coolness of [nock](https://github.com/flatiron/nock), but I wanted persistence and to learn stuff. 

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

create directories for collections to store json files. 
e.g. `test/fixtures/slayer-albums`

###routes

GET /api/:collection  
lists an array of models created from `*.json` files in collection dir.  
alternatively serves a `list.json` instead of one file per model.

GET /api/:collection/:id  
shows a `:id.json` file

POST /api/:collection  
generates a unique id and saves to an `:id.json` file

PUT /api/:collection/:id  
updates an `:id.json` file
	
DELETE /api/:collection/:id  
deletes `:id.json` file


[![Build Status](https://travis-ci.org/twalker/mocki.png)](https://travis-ci.org/twalker/mocki)
-----------------

## messy notes from mocki's adventures


### TODO

-[] use async or something to cleanup the async/conditional madness in list action.
-[] double check error handling best practice
-[] clean up this mess of a readme

need to figure out how exactly I want to use it in app before I get too far. 
I want to use it to swap out for the real restful resource api based on NODE_ENV.  
Stand alone server or middleware?  
If middleware, I can use it per collection and let the routing be handled by the consuming app. mocki just responds and lets the client determine which requests to forward.

####problems:

- same origin policy restricts to the same port that the client's using. should look into cors.
- when using a proxy in the client, express.bodyParser() changes the request to where http-proxy doesn't forward POST, DELETE, UPDATE requests properly [more info](https://github.com/nodejitsu/node-http-proxy/issues/180). The fix is to register the middleware before the bodyParser.
