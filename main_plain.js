#!/usr/bin/env node
var http = require('http'),
	path = require('path'),
	fs = require('fs'),
	url = require("url"),
	mime = require('mime');

var port = process.env.PORT || 9000;
var host = process.env.HOST || "localhost";
var root = ".";
// Create a node-static server instance to serve the './public' folder
//var file = new(static.Server)('./mocks');

http.createServer(function (request, response) {
  //res.writeHead(200, { 'Content-Type': 'text/plain' });
  //res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2));
  //res.end();
  console.log('requesting', request.url);
  //fs.sendfile(req.url + "index.json");
  //req.addListener('end', function(){
	//file.serve(req, res);
  //});
	var uri = url.parse(request.url).pathname;
	console.log('uri', uri);
	/*
	if (fs.statSync(filename).isDirectory()) {
		filename += '/index';
	}
	*/
	//var filename = root.join(path, uri, '.json');
	var filename = path.join(__dirname, uri);
	console.log('filename', filename);
	fs.exists(filename, function (exists) {
		console.log('filename', filename);
		if (!exists) {
			response.writeHead(404, {
				"Content-Type": "text/plain"
			});
			response.write("404 Not Found:" + filename);
			response.end();
			return;
		}

		

		fs.readFile(filename, "binary", function (err, file) {
			if (err) {
				response.writeHead(500, {
					"Content-Type": "text/plain"
				});
				response.write(err + "\n");
				response.end();
				return;
			}

			var type = mime.lookup(filename);
			response.writeHead(200, {
				"Content-Type": type
			});
			response.write(file, "binary");
			response.end();
		});
	});
}).listen(port, host);

console.log("mocki listening to", "http://" + host + ":" + port);