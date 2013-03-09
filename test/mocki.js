var fs = require('fs'),
	path = require('path'),
	chai = require("chai"),
	assert = chai.assert,
	expect = chai.expect,
	request = require('supertest'),
	express = require('express');

var app = require('../app');

//TODO: wrap all the test mocks into a sensible object
var mocksPath = path.join(__dirname, 'fixtures', 'mycollection'),
	fooPath = path.join(mocksPath, 'foo.json'),
	barPath = path.join(mocksPath, 'bar.json'),
	listPath = path.join(mocksPath, 'list.json');

if(!fs.existsSync(mocksPath)) fs.mkdirSync(mocksPath);

var mycollection = [
	{"id":"foo"},
	{"id":"bar"}
];
var byId = function(a, b){
	return a.id.localeCompare(b.id);
}

describe('mocki', function(){

	beforeEach(function(){
		fs.writeFileSync(fooPath, JSON.stringify({"id":"foo"}))
		fs.writeFileSync(barPath, JSON.stringify({"id":"bar"}))
	});

	afterEach(function(){
		if(fs.existsSync(fooPath)) fs.unlinkSync(fooPath)
		if(fs.existsSync(barPath)) fs.unlinkSync(barPath)
	});

	describe('GET /:collection', function(){

		it('should respond with json', function(done){
			request(app)
				.get('/api/mycollection')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});

		it('should respond with an resource collection/array from files', function(done){
			request(app)
				.get('/api/mycollection')
				.set('Accept', 'application/json')
				.end(function(err, res){
					if(err) return done(err)
					assert.deepEqual(res.body.sort(byId), mycollection.sort(byId));
					assert.equal(res.body.length, 2)
					done();
				});
		});

		it('should respond with a 404 when the collection dir doesn\'t exist', function(done){
			request(app)
				.get('/api/does-not-exist')
				.expect(404, done);
		});

		describe('list.json', function(){
			var collection2 = [{id:"baz"}, {id:"qux"}];
			before(function(){
				fs.writeFileSync(listPath, JSON.stringify(collection2));
			});

			after(function(){
				fs.unlinkSync(listPath)
			});

			it('should serve alternative list.json file when it exists', function(done){
				request(app)
					.get('/api/mycollection')
					.end(function(err, res){
						if(err) return done(err)
						assert.deepEqual(res.body.sort(byId), collection2.sort(byId));
						assert.equal(res.body.length, 2)
						done();
					});

			});
		})
	});

	describe('GET /:collection/:id', function(){

		it('should respond with json for a single resource', function(done){
			request(app)
				.get('/api/mycollection/foo')
				.set('Accept', 'application/json')
				.expect({"id":"foo"}, done);
		});
		it('should respond with not found', function(done){
			request(app)
				.get('/api/mycollection/does-not-exist')
				.expect(404, done);
		});

	});

	describe('POST /:collection', function(){
		var filepath = path.join(mocksPath, 'baz.json');

		after(function(){
			fs.unlinkSync(filepath)
		});

		it('should create json files from post', function(done){
			request(app)
				.post('/api/mycollection')
				.send({"id": "baz"})
				.expect({"id": "baz"})
				.end(function(err, res){
					if(err) return done(err)
					fs.exists(filepath, function(exists){
						assert(exists);
						done()
					});
				});

		});
	});

	describe('PUT /:collection/:id', function(){
		it('should update json files', function(done){
			request(app)
				.put('/api/mycollection/foo')
				.send({"id": "foo", "a": 1})
				.expect({"id": "foo", "a": 1})
				.end(done);
		});
	});

	describe('DELETE /:collection/:id', function(){
		it('should delete json files and return a 204 "No Content"', function(done){
			request(app)
				.del('/api/mycollection/foo')
				.expect(204)
				.end(function(err, res){
					if(err) return done(err)
					fs.exists(fooPath, function(exists){
						assert(!exists);
						done();
					});
				});
		});
	});
});