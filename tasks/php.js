'use strict';
module.exports = function (grunt) {
	var path = require('path');
	var open = require('open');
	var spawn = require('pty.js').spawn;

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
			cwd: path.resolve(options.base)
		});

		cp.stdout.pipe(process.stdout);

		cp.once('data', function () {
			if (!this.flags.keepalive && !options.keepalive) {
				cb();
			}

			if (options.open) {
				open('http://' + host);
			}
		}.bind(this));

		// quit PHP when grunt is done
		process.on('exit', function () {
			cp.kill();
		});
	});
};
