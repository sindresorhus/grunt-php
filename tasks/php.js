'use strict';
var spawn = require('child_process').spawn;
var http = require('http');
var open = require('opn');
var binVersionCheck = require('bin-version-check');
var getPort = require('get-port');
var objectAssign = require('object-assign');

module.exports = function (grunt) {
	var checkServerTries = 0;
	var serverStarted = false;

	function checkServer(hostname, port, path, done) {
		setTimeout(function () {
			http.request({
				method: 'HEAD',
				hostname: hostname,
				port: port,
				path: path
			}, function (res) {
				var statusCodeType = Number(res.statusCode.toString()[0]);
				if ([2, 3, 4].indexOf(statusCodeType) !== -1) {
					if (!serverStarted) {
						serverStarted = true;
						done(true);
					}
					return;
				} else if (statusCodeType === 5) {
					grunt.fail.warn(
						'Server docroot returned 500-level response. Please check ' +
						'your configuration for possible errors.'
					);
					if (!serverStarted) {
						serverStarted = true;
						done(true);
					}
					return;
				}
				checkServer(hostname, port, path, done);
			}).on('error', function (err) {
				// back off after 1s
				if (!serverStarted) {
					if (++checkServerTries > 20) {
						return done(false);
					}
					grunt.verbose.writeln('PHP server not started. Retrying...');
					checkServer(hostname, port, path, done);
				}
			}).end();
		}, 50);
	}

	grunt.registerMultiTask('php', 'Start a PHP-server', function () {
		checkServerTries = 0;
		serverStarted = false;

		var done = this.async();
		var options = this.options({
			port: 8000,
			hostname: '127.0.0.1',
			base: '.',
			keepalive: false,
			open: false,
			bin: 'php',
			silent: false,
			env: {},
			directives: {}
		});

		getPort(function (err, port) {
			if (err) {
				grunt.warn(err);
				done(false);
				return;
			}

			if (options.port === '?') {
				options.port = port;
			}

			var host = options.hostname + ':' + options.port;
			var args = ['-S', host];

			if (options.ini) {
				args.push('-c', options.ini);
			}

			if (options.directives) {
				for (var key in options.directives) {
					args.push('-d', key + '=' + options.directives[key]);
				}
			}

			if (options.router) {
				args.push(options.router);
			}

			binVersionCheck(options.bin, '>=5.4', function (err) {
				if (err) {
					grunt.warn(err);
					done(false);
					return;
				}

				var cp = spawn(options.bin, args, {
					cwd: options.base,
					stdio: options.silent ? 'ignore' : 'inherit',
					env: objectAssign({}, process.env, options.env)
				});

				// quit PHP when grunt is done
				process.on('exit', function () {
					cp.kill();
				});

				var path = '/';
				if (typeof options.open === 'string') {
					path = (options.open.indexOf('/') !== 0 ? '/' : '') + options.open;
				}
				// check when the server is ready. tried doing it by listening
				// to the child process `data` event, but it's not triggered...
				checkServer(options.hostname, options.port, path, function () {
					if (!this.flags.keepalive && !options.keepalive) {
						done(true);
					}

					if (options.open) {
						open('http://' + host + path);
					}

				}.bind(this));
			}.bind(this));
		}.bind(this));
	});
};
