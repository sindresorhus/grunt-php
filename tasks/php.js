'use strict';
const phpServer = require('php-server');

module.exports = grunt => {
	grunt.registerMultiTask('php', 'Start a PHP server', async function () {
		const done = this.async();

		const options = this.options({
			silent: false,
			keepAlive: false
		});

		try {
			const server = await phpServer(options);

			if (!options.silent) {
				server.stdout.pipe(process.stdout);
				server.stderr.pipe(process.stderr);
			}

			if (!this.flags.keepAlive && !options.keepAlive) {
				done();
			}
		} catch (error) {
			grunt.warn(error);
			done();
		}
	});
};
