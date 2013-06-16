/*global describe it */
'use strict';
var assert = require('assert');
var request = require('request');

describe('grunt-php', function () {
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
});
