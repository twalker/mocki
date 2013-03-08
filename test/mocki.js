var path = require('path'),
	chai = require("chai"),
	assert = chai.assert,
	expect = chai.expect,
	request = require('supertest'),
	express = require('express');

var app = require('../routes/mocki')(path.join(__dirname,'..' ,'mocks'));

var mycollection = [
	{"id":"foo"},
	{"id":"bar"}
];

describe('mocki', function(){
	describe('GET /:collection', function(){

		it('should respond with json', function(done){
			request(app)
				.get('/mycollection')
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});

		it('should respond with an resource collection/array  from files', function(done){
			request(app)
				.get('/mycollection')
				.set('Accept', 'application/json')
				.end(function(err, res){
					if(err) return done(npmerr)
					assert.deepEqual(res.body.sort(), mycollection.sort());
					done();
				});
		});
	});

	describe.skip('POST /:collection', function(){

		it('should create json files from post', function(done){
			request(app)
				.post('/mycollection')
				.send({"id": "baz"})
				.set('Accept', 'application/json')
				.expect({"id": "baz"}, done);
		});
	});

	describe('GET /:collection/:id', function(){

		it('should respond with json for a single resource', function(done){
			request(app)
				.get('/mycollection/foo')
				.set('Accept', 'application/json')
				.expect(mycollection[0], done);
		});
	});
});
