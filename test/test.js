'use strict';
var assert = require('assert');
var request = require('request');

it('should start a PHP-server', function (cb) {
	this.timeout(20000);

	request.get('http://0.0.0.0:8008', function (err, response, body) {
		if (err) {
			cb(err);
			return;
		}

		assert.equal(response.statusCode, 200);
		assert.equal(body, 'Hello World');
		cb();
	});
});

it('should start a PHP-server when the status code is 301', function (cb) {
	this.timeout(20000);

	request.get('http://0.0.0.0:8009', function (err, response, body) {
		if (err) {
			cb(err);
			return;
		}

		assert.equal(response.statusCode, 200);
		assert.equal(body, '301 Redirected!');
		cb();
	});
});

it('should start a PHP-server when the status code is 400', function (cb) {
	this.timeout(20000);

	request.get('http://0.0.0.0:8010', function (err, response, body) {
		if (err) {
			cb(err);
			return;
		}

		assert.equal(response.statusCode, 400);
		cb();
	});
});

it('should start a PHP-server when the status code is 404', function (cb) {
	this.timeout(20000);

	request.get('http://0.0.0.0:8011', function (err, response, body) {
		if (err) {
			cb(err);
			return;
		}

		assert.equal(response.statusCode, 404);
		cb();
	});
});

it('should expose environment variables', function (cb) {
	this.timeout(20000);

	request.get('http://0.0.0.0:8021', function (err, response, body) {
		if (err) {
			cb(err);
			return;
		}

		assert.equal(body, 'foobar');
		cb();
	});
});
