/* eslint-disable guard-for-in */
'use strict';
const {promisify} = require('util');
const path = require('path');
const {spawn} = require('child_process');
const http = require('http');
const open = require('open');
const binVersionCheck = require('bin-version-check');
const getPort = require('get-port');

module.exports = grunt => {
	let checkServerTries = 0;

	// TODO: Refactor this into using a `Promise` constructor
	const checkServer = (hostname, port, path, callback) => {
		setTimeout(() => {
			http.request({
				method: 'HEAD',
				hostname,
				port,
				path
			}, response => {
				const statusCodeType = Number(response.statusCode.toString()[0]);
				if ([2, 3, 4].includes(statusCodeType)) {
					callback();
					return;
				}

				if (statusCodeType === 5) {
					grunt.fail.warn('Server docroot returned 500-level response. Please check your configuration for possible errors.');
					callback();
					return;
				}

				checkServer(hostname, port, path, callback);
			}).on('error', () => {
				// Back off after 1 second
				if (++checkServerTries > 20) {
					callback();
					return;
				}

				grunt.verbose.writeln('PHP server not started. Retrying...');
				checkServer(hostname, port, path, callback);
			}).end();
		}, 50);
	};

	const checkServerPromise = promisify(checkServer);

	grunt.registerMultiTask('php', 'Start a PHP-server', async function () {
		const done = this.async();

		const options = this.options({
			port: 8000,
			hostname: '127.0.0.1',
			base: '.',
			keepalive: false,
			open: false,
			binary: 'php',
			silent: false,
			env: {},
			directives: {}
		});

		try {
			const port = await getPort();

			if (options.port === '?') {
				options.port = port;
			}

			const host = `${options.hostname}:${options.port}`;

			const spawnArguments = ['-S', host];

			if (options.base) {
				spawnArguments.push('-t', path.resolve(options.base));
			}

			if (options.ini) {
				spawnArguments.push('-c', options.ini);
			}

			if (options.directives) {
				for (const key in options.directives) {
					spawnArguments.push('-d', `${key}=${options.directives[key]}`);
				}
			}

			if (options.router) {
				spawnArguments.push(options.router);
			}

			await binVersionCheck(options.binary, '>=5.4');

			const cp = spawn(options.binary, spawnArguments, {
				stdio: options.silent ? 'ignore' : 'inherit',
				env: {
					...process.env,
					...options.env
				}
			});

			// Quit PHP when Grunt is done
			process.on('exit', () => {
				cp.kill();
			});

			let pathname = '/';
			if (typeof options.open === 'string') {
				pathname = (options.open.indexOf('/') === 0 ? '' : '/') + options.open;
			}

			// Check when the server is ready. Tried doing it by listening
			// to the child process `data` event, but it's not triggered...
			await checkServerPromise(options.hostname, options.port, pathname);

			if (!this.flags.keepalive && !options.keepalive) {
				done();
			}

			if (options.open) {
				await open(`http://${host}${pathname}`);
			}
		} catch (error) {
			grunt.warn(error);
			done();
		}
	});
};
