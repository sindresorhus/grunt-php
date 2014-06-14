'use strict';
var assert = require('assert');
var request = require('request');

describe('grunt-php', function () {
	this.timeout(20000);
	it('should start a PHP-server', function (cb) {
		request.get('http://0.0.0.0:8008', function (err, response, body) {
			if (err) {
				return cb(err);
			}

			assert.equal(response.statusCode, 200);
			assert.equal(body, 'Hello World');
			cb();
		});
	});

	it('should start a PHP-server when the status code is 301', function (cb) {
		request.get('http://0.0.0.0:8009', function (err, response, body) {
			if (err) {
				return cb(err);
			}

			assert.equal(response.statusCode, 200);
			assert.equal(body, '301 Redirected!');
			cb();
		});
	});
});
