var path = require('path'),
	fs = require('fs'),
	uuid = require('node-uuid');

var mockspath = path.join(__dirname, '..', 'mocks');

exports.list = function(req, res){
	// todo: server list.json if it exists, otherwise create json from files.
	var collection = req.param('collection');
	var dirPath = path.join(mockspath, collection);
	
	// TOREVISIT: Need to figure out proper recursion in the async approach.
	/*
	// sync style:
	var files = fs.readdirSync(dirPath);
	files.forEach(function(filename){
		var data = fs.readFileSync(path.join(dirPath, filename));
		models.push(JSON.parse(data));
	});
	res.send(models);
	console.log('listing');
	*/

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
				console.log('😌  listing', models);
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
};

exports.show = function(req, res){
	var filePath = path.join(mockspath, req.param('collection'), req.param('id') + '.json');
	fs.exists(filePath, function (exists) {
		if(exists){
			fs.readFile(filePath, function(err, data){
				if(err) throw err;
				res.json(JSON.parse(data));
				console.log('😌  showed: ', filePath);
			});
		} else {
			res.json(404, {error: filePath + " not found."});
		}
	});
};

exports.create = function(req, res){
	var json = req.body;
	var id = json.id = json.id || uuid.v1();
	var collection = req.param('collection');
	var filePath = path.join(mockspath, collection, id + '.json');
	
	// TODO: make collection dir if it doesn't exist
	fs.writeFile(filePath, JSON.stringify(json), function (err) {
		if(err) throw err;
		console.log('😌  saved: ', filePath);
	});
	
	res.json(json);
};

exports.update = function(req, res){
	// repetetive of create method
	var json = req.body;
	var id = json.id = json.id || uuid.v1();
	var filePath = path.join(mockspath, req.url + '.json');

	fs.writeFile(filePath, JSON.stringify(json), function (err) {
		if(err) throw err;
		console.log('😌  updated: ', filePath);
	});
	
	res.json(json);
};

exports.destroy = function(req, res){
	//var filePath = path.join(mockspath, req.url + '.json');
	var filePath = path.join(mockspath, req.param('collection'), req.param('id') + '.json');
	fs.readFile(filePath, function(err, data){
		if(err) throw err;
		res.json(JSON.parse(data));
		fs.unlink(filePath, function(e){
			console.log('😌  deleted: ' + filePath);
		});
	});
	
};

// TOREVISIT: is there away around the special route?
exports.bootstrap = function(req, res){
	console.log('boostrap called');
	var filePath = path.join(mockspath, 'bootstrap.json');
	fs.exists(filePath, function (exists) {
		if(exists){
			fs.readFile(filePath, function(err, data){
				if(err) throw err;
				res.json(JSON.parse(data));
				console.log('😌  showed: ', filePath);
			});
		} else {
			res.json(404, filePath + " not found.");
		}
	});
};