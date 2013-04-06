'use strict';
module.exports = function (grunt) {
	var path = require('path');
	var spawn = require('child_process').spawn;
	var http = require('http');
	var open = require('open');

	function checkServer(url, cb) {
		setTimeout(function () {
			http.get(url, function (res) {
				if (res.statusCode === 200) {
					return cb();
				}

				checkServer(url, cb);
			}).on('error', function () {
				checkServer(url, cb);
			});
		}, 400);
	}

	grunt.registerMultiTask('php', function () {
		var cb = this.async();
		var options = this.options({
			port: 8000,
			hostname: 'localhost',
			base: '.',
			keepalive: false,
			open: false
		});
		var host = options.hostname + ':' + options.port;
		var args = ['-S', host];

		if (options.router) {
			args.push(options.router);
		}

		var cp = spawn('php', args, {
			cwd: path.resolve(options.base),
			stdio: 'inherit'
		});

		// quit PHP when grunt is done
		process.on('exit', function () {
			cp.kill();
		});

		// check when the server is ready. tried doing it by listening
		// to the child process `data` event, but it's not triggered...
		checkServer('http://' + host, function () {
			if (!this.flags.keepalive && !options.keepalive) {
				cb();
			}

			if (options.open) {
				open('http://' + host);
			}
		}.bind(this));
	});
};
