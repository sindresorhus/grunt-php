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
					base: 'test',
					keepalive: true,
					open: true
				}
			},
			test200: {
				options: {
					port: 8008,
					hostname: '0.0.0.0',
					base: 'test/200',
					bin: 'php'
				}
			},
			test301: {
				options: {
					port: 8009,
					hostname: '0.0.0.0',
					base: 'test/301',
					bin: 'php'
				}
			},
			test302: {
				options: {
					port: 8010,
					hostname: '0.0.0.0',
					base: 'test/302',
					bin: 'php'
				}
			},

			test400: {
				options: {
					port: 8011,
					hostname: '0.0.0.0',
					base: 'test/400',
					bin: 'php'
				}
			},
			test404: {
				options: {
					port: 8012,
					hostname: '0.0.0.0',
					base: 'test/404',
					bin: 'php'
				}
			},
			test500: {
				options: {
					port: 8020,
					hostname: '0.0.0.0',
					base: 'test/500',
					bin: 'php'
				}
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('phpwatch', ['php:test200', 'watch']);
	grunt.registerTask('default', [
		'php:test200',
		'php:test301',
		'php:test302',
		'php:test400',
		'php:test404',
		'simplemocha:test']
	);
};
