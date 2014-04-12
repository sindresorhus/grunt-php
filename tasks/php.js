'use strict';
module.exports = function (grunt) {
	var path = require('path');
	var spawn = require('child_process').spawn;
	var http = require('http');
	var open = require('open');

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

		if (options.open) {
			open('http://' + host);
		}

		cb();
	});
};
