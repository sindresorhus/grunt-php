'use strict';
module.exports = function (grunt) {
	grunt.initConfig({
		simplemocha: {
			test: {
				src: 'test/test.js'
			}
		},
		watch: {
			test: {
				files: ['noop']
			}
		},
		php: {
			open: {
				options: {
					port: 7007,
					hostname: 'localhost',
					base: 'test',
					keepalive: true,
					open: true
				}
			},
			test: {
				options: {
					port: 8008,
					hostname: 'localhost',
					base: 'test'
				}
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('phpwatch', ['php:test', 'watch']);
	grunt.registerTask('default', ['php:test', 'simplemocha:test']);
};
