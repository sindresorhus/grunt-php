/* eslint-env mocha */
'use strict';
const {strict: assert} = require('assert');
const got = require('got');

it('start a PHP server', async () => {
	const response = await got('http://0.0.0.0:8008');
	assert.equal(response.statusCode, 200);
	assert.equal(response.body, 'Hello World');
});

it('start a PHP server when the status code is 301', async () => {
	const response = await got('http://0.0.0.0:8009');
	assert.equal(response.statusCode, 200);
	assert.equal(response.body, '301 Redirected!');
});

it('start a PHP server when the status code is 400', async () => {
	const error = await got('http://0.0.0.0:8010', {throwHttpErrors: false});
	assert.equal(error.statusCode, 400);
});

it('start a PHP server when the status code is 404', async () => {
	const error = await got('http://0.0.0.0:8011', {throwHttpErrors: false});
	assert.equal(error.statusCode, 404);
});

it('expose environment variables', async () => {
	const {body} = await got('http://0.0.0.0:8021');
	assert.equal(body, 'foobar');
});

it('expose custom INI directive', async () => {
	const {body} = await got('http://0.0.0.0:8022');
	assert.equal(body, 'foobar');
});
