'use strict';
module.exports = function (grunt) {
	grunt.initConfig({
		simplemocha: {
			test: {
				src: 'test/test-php.js'
			}
		},
		php: {
			open: {
				options: {
					port: 7000,
					hostname: '0.0.0.0',
					base: 'test',
					keepalive: true,
					open: true
				}
			},
			test: {
				options: {
					port: 6000,
					hostname: '0.0.0.0',
					base: 'test'
				}
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-simple-mocha');

	grunt.registerTask('default', ['php:test', 'simplemocha:test']);
};
