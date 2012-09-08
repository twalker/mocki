var path = require('path'),
	fs = require('fs'),
	uuid = require('node-uuid');

var mockspath = path.join(__dirname, '..', 'mocks');

var resolveToJson = function(url){
	return "to do: add .json to url";
};
var mkdir = function(path, root) {

	var dirs = path.split('/'), dir = dirs.shift(), root = (root||'')+dir+'/';

	try { fs.mkdirSync(root); }
	catch (e) {
		//dir wasn't made, something went wrong
		if(!fs.statSync(root).isDirectory()) throw new Error(e);
	}

	return !dirs.length||mkdir(dirs.join('/'), root);
}
//mkdir('parent/child/grandchild');

exports.list = function(req, res){
	res.send('list');
};

exports.create = function(req, res){
	console.log('params', req.params);
	console.log('collection', req.param('collection'));

	var json = req.body;
	var id = json.id = json.id || uuid.v1();
	var filePath = path.join(mockspath, req.url, id + '.json');
	
	fs.writeFile(filePath, JSON.stringify(json), function (err) {
		if(err) throw err;
		console.log('file saved: ', filePath);
	});
	
	res.send(json);
};

exports.show = function(req, res){
	var filePath = path.join(mockspath, req.url + '.json');
	//fileServer.serveFile('/error.html', 500, {}, request, response);
	res.send('show');
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
	var filePath = path.join(mockspath, req.url + '.json');
	fs.readFile(filePath, function(err, data){
		if(err) throw err;
		res.send(JSON.parse(data));
		fs.unlink(filePath, function(e){
			console.log('file deleted: ' + filePath);
		});
	});
	
};