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
			openUrl: {
				options: {
					port: 7008,
					base: 'test/200',
					keepalive: true,
					open: 'http://localhost:7008/index2.php'
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
			test400: {
				options: {
					port: 8010,
					hostname: '0.0.0.0',
					base: 'test/400',
					bin: 'php'
				}
			},
			test404: {
				options: {
					port: 8011,
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
			},
			testEnv: {
				options: {
					port: 8021,
					hostname: '0.0.0.0',
					base: 'test/env',
					bin: 'php',
					env: {
						FOOBAR: 'foobar'
					}
				}
			},
			serve: {
				options: {
					hostname: '127.0.0.1',
					port: 9000,
					base: 'test/browsersync',
					keepalive: false,
					open: false
				}
			}
		},
		browserSync: {
			serve: {
				bsFiles: {
					src: [
						'test/browsersync/styles.css',
						'test/browsersync/index.php'
					]
				},
				options: {
					proxy: '<%= php.serve.options.hostname %>:<%= php.serve.options.port %>',
					watchTask: true,
					notify: true,
					open: true,
					logLevel: 'silent',
					ghostMode: {
						clicks: true,
						scroll: true,
						links: true,
						forms: true
					}
				}
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');

	grunt.registerTask('phpwatch', [
		'php:test200',
		'watch'
	]);

	grunt.registerTask('serve', [
		'php:serve',
		'browserSync:serve',
		'watch'
	]);

	grunt.registerTask('default', [
		'php:test200',
		'php:test301',
		'php:test400',
		'php:test404',
		'php:testEnv',
		'simplemocha:test'
	]);
};
