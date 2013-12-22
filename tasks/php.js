'use strict';
module.exports = function (grunt) {
	var path = require('path');
	var spawn = require('child_process').spawn;
	var http = require('http');
	var open = require('open');
	var checkServerTries = 0;

	function checkServer(hostname, port, cb) {
		setTimeout(function () {
			http.request({
				method: 'HEAD',
				hostname: hostname,
				port: port
			}, function (res) {
				if (res.statusCode === 200 || res.statusCode === 404) {
					return cb();
				}

				checkServer(hostname, port, cb);
			}).on('error', function (err) {
				// back off after 1s
				if (++checkServerTries > 20) {
					return cb();
				}

				checkServer(hostname, port, cb);
			}).end();
		}, 50);
	}

	grunt.registerMultiTask('php', 'Start a PHP-server', function () {
		var cb = this.async();
		var options = this.options({
			port: 8000,
			hostname: '127.0.0.1',
			base: '.',
			keepalive: false,
			open: false,
			bin: 'php'
		});
		var host = options.hostname + ':' + options.port;
		var args = ['-S', host];

		if (options.router) {
			args.push(options.router);
		}

		var cp = spawn(options.bin, args, {
			cwd: path.resolve(options.base),
			stdio: 'inherit'
		});

		// quit PHP when grunt is done
		process.on('exit', function () {
			cp.kill();
		});

		// check when the server is ready. tried doing it by listening
		// to the child process `data` event, but it's not triggered...
		checkServer(options.hostname, options.port, function () {
			if (!this.flags.keepalive && !options.keepalive) {
				cb();
			}

			if (options.open) {
				open('http://' + host);
			}
		}.bind(this));
	});
};
