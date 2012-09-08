var path = require('path'),
	fs = require('fs'),
	uuid = require('node-uuid');

var mockspath = path.join(__dirname, '..', 'mocks');

exports.list = function(req, res){
	res.send('list');
};

exports.create = function(req, res){
	
	var json = req.body;
	var id = json.id = json.id || uuid.v1();
	var filePath = path.join(mockspath, req.url, id + '.json');
	
	fs.writeFile(filePath, JSON.stringify(json), function (err) {
		if(err) throw err;
		console.log('file saved to', filePath);
	});
	
	res.send(json);
};

exports.show = function(req, res){
	res.send('show');
};

exports.update = function(req, res){
	res.send('update');
};


exports.del = function(req, res){
	var filePath = path.join(mockspath, req.url + '.json');
	fs.unlink(filePath, function(err){
		if(err) throw err;
	});
	res.send('deleted');
};