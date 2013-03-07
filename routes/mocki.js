/*
	mocki mocks backbone model resource requests
	and responds with mock json files in /test/fixtures.
*/
var path = require('path'),
	fs = require('fs'),
	uuid = require('node-uuid'),
	express = require('express');

var actions = {

	list: function(req, res){
		var collection = req.param('collection');
		var dirPath = path.join(mockspath, collection);

		fs.readdir(dirPath, function(err, files){
			if(err) throw err;
			var models = [],
				len = files.length,
				i = 0;

			var addToList = function addToList(err, data){
				if(err) throw err;

				models.push(JSON.parse(data));
				if(i === len -1){
					res.json(models);
					//console.log('mock listed', models);
				} else {
					i++;
				}
			};

			if(len === 0) {
				res.json(models);
			} else {
				files.forEach(function(filename){
					fs.readFile(path.join(dirPath, filename), addToList);
				});
			}
		});
	},

	show: function(req, res){
		var filePath = path.join(mockspath, req.param('collection'), req.param('id') + '.json');
		fs.exists(filePath, function (exists) {
			if(exists){
				fs.readFile(filePath, function(err, data){
					if(err) throw err;
					res.json(JSON.parse(data));
					//console.log('mock shown: ', filePath);
				});
			} else {
				res.json(404, {error: filePath + " not found."});
			}
		});
	},

	create: function(req, res){
		var json = req.body;
		var id = json.id = json.id || uuid.v1();
		var collection = req.param('collection');
		var filePath = path.join(mockspath, collection, id + '.json');

		fs.writeFile(filePath, JSON.stringify(json), function (err) {
			if(err) throw err;
			//console.log('mock saved: ', filePath);
		});

		res.json(json);
	},

	update: function(req, res){
		// repetitive of create method, refactor
		var json = req.body;
		var id = json.id = json.id || uuid.v1();
		var collection = req.param('collection');
		var filePath = path.join(mockspath, collection, id + '.json');

		fs.writeFile(filePath, JSON.stringify(json), function (err) {
			if(err) throw err;
			//console.log('mock updated: ', filePath);
		});

		res.json(json);
	},

	destroy: function(req, res){
		var filePath = path.join(mockspath, req.param('collection'), req.param('id') + '.json');
		fs.readFile(filePath, function(err, data){
			if(err) throw err;
			res.json(JSON.parse(data));
			fs.unlink(filePath, function(e){
				//console.log('mock destroyed: ' + filePath);
			});
		});
	}
};

var mockspath = path.join(__dirname,'..' ,'test', 'fixtures');

module.exports = function(fixturesPath){
	var app = express();
	if(fixturesPath) {
		mockspath = fixturesPath;
	}

	// route to typical RESTful resource actions
	app.get('/:collection/:id', actions.show);
	app.get('/:collection', actions.list);
	app.post('/:collection', actions.create);
	app.put('/:collection/:id', actions.update);
	app.del('/:collection/:id', actions.destroy);

	return app;
};



