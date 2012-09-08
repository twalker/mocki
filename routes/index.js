var path = require('path'),
	fs = require('fs'),
	uuid = require('node-uuid');

var mockspath = path.join(__dirname, '..', 'mocks');

exports.list = function(req, res){
	// todo: server list.json if it exists, otherwise create json from files.
	var collection = req.param('collection');
	var dirPath = path.join(mockspath, collection);
	var models = [];
	// TOREVISIT: doing Sync file io, shame on me. need to figure out how async approach.
	var files = fs.readdirSync(dirPath);
	files.forEach(function(filename){
		var data = fs.readFileSync(path.join(dirPath, filename));
		models.push(JSON.parse(data));
	});

	res.send(models);

	/*
	fs.readdir(dirPath, function(err, files){
		console.log('files', files);
		var models = [];
		files.forEach(function(filename){
			fs.readFile(path.join(dirPath, filename), function(err, data){
				console.log('found', data);
				models.push(JSON.parse(data));
			});
		});
		
		console.log('models', models);
	});
	*/
	console.log('listing', models);
};

exports.show = function(req, res){
	var filePath = path.join(mockspath, req.param('collection'), req.param('id') + '.json');
	fs.exists(filePath, function (exists) {
		if(exists){
			fs.readFile(filePath, function(err, data){
				if(err) throw err;
				res.send(JSON.parse(data));
				console.log('file shown: ', filePath);
			});
		} else {
			res.send(404, filePath + " not found.");
		}
	});
};

exports.create = function(req, res){
	var json = req.body;
	var id = json.id = json.id || uuid.v1();
	var collection = req.param('collection');
	var filePath = path.join(mockspath, collection, id + '.json');
	
	fs.writeFile(filePath, JSON.stringify(json), function (err) {
		if(err) throw err;
		console.log('file saved: ', filePath);
	});
	
	res.send(json);
};



exports.update = function(req, res){
	// repetetive of create method
	var json = req.body;
	var id = json.id = json.id || uuid.v1();
	var filePath = path.join(mockspath, req.url + '.json');

	fs.writeFile(filePath, JSON.stringify(json), function (err) {
		if(err) throw err;
		console.log('file updated: ', filePath);
	});
	
	res.send(json);
};


exports.del = function(req, res){
	//var filePath = path.join(mockspath, req.url + '.json');
	var filePath = path.join(mockspath, req.param('collection'), req.param('id') + '.json');
	fs.readFile(filePath, function(err, data){
		if(err) throw err;
		res.send(JSON.parse(data));
		fs.unlink(filePath, function(e){
			console.log('file deleted: ' + filePath);
		});
	});
	
};