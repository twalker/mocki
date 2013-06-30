## 😌  mocki

A little server of mock json files for backbone models & collections. 
It can be mounted by an existing express app or run as a standalone server.

it serves json files in `test/fixtures/:collection` by default

maybe someday mocki will grow up to be a grunt task, or accept handy options like a routes hash, or just provide actions...  
or maybe remain a happy little script. 

mocki has less that 1/1000th the coolness of [nock](https://github.com/flatiron/nock), but I wanted persistence and to learn stuff. 

---------------

### usage

create directories for collections to store json files. 
e.g. `test/fixtures/slayer-albums`

place your fixture/mock files in the collection folders named by id.  
e.g. `south-of-heaven.json`



#### mounting as a sub-app

to **mount** mocki, copy `routes/mocki.js` and use as middleware in a hosting express app:

		var http = require('http'),
				express = require('express'),
				mocki = require('./routes/mocki');
		//...
		app.use('/api', mocki()); // mount mocks at /api
		//...
		http.createServer(app).listen(app.get('port'), function(){
			console.log("mock routes mounted on /api");
		});

the [standalone server](app.js) does just that.

#### running as a stand-alone express app

`$ npm start`  
`mocki mounted at: http://localhost:8000/api`  

then, start sending your xhr requests to the hosted url:

		var SlayerAlbums = Backbone.Collection.extend({
			url: 'http://localhost:8000/api/slayer-albums',
			...
		});
		var slayer = new SlayerAlbums();
		slayer.fetch()

Origin headers are set to allow CORS.

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

All verbs are repeated for a nested resources  
[VERB] /api/:collection/:id/:subcollection  

[![Build Status](https://travis-ci.org/twalker/mocki.png)](https://travis-ci.org/twalker/mocki)

-----------------

### TODO

- double check error handling best practice

My cat sniffed this work, and typed:  
00000000000000000000000000000
