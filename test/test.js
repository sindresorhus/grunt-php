'use strict';
var assert = require('assert');
var got = require('got');

it('should start a PHP-server', function (cb) {
	this.timeout(20000);

	got('http://0.0.0.0:8008', function (err, data, res) {
		if (err) {
			cb(err);
			return;
		}

		assert.equal(res.statusCode, 200);
		assert.equal(data, 'Hello World');
		cb();
	});
});

it('should start a PHP-server when the status code is 301', function (cb) {
	this.timeout(20000);

	got('http://0.0.0.0:8009', function (err, data, res) {
		if (err) {
			cb(err);
			return;
		}

		assert.equal(res.statusCode, 200);
		assert.equal(data, '301 Redirected!');
		cb();
	});
});

it('should start a PHP-server when the status code is 400', function (cb) {
	this.timeout(20000);

	got('http://0.0.0.0:8010', function (err) {
		assert.equal(err.code, 400);
		cb();
	});
});

it('should start a PHP-server when the status code is 404', function (cb) {
	this.timeout(20000);

	got('http://0.0.0.0:8011', function (err) {
		assert.equal(err.code, 404);
		cb();
	});
});

it('should expose environment variables', function (cb) {
	this.timeout(20000);

	got('http://0.0.0.0:8021', function (err, data) {
		if (err) {
			cb(err);
			return;
		}

		assert.equal(data, 'foobar');
		cb();
	});
});

it('should expose custom ini directive', function (cb) {
	this.timeout(20000);

	got('http://0.0.0.0:8022', function (err, data) {
		if (err) {
			cb(err);
			return;
		}

		assert.equal(data, 'foobar');
		cb();
	});
});
