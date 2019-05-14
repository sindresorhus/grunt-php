/* eslint-disable quote-props */
'use strict';

module.exports = grunt => {
	grunt.initConfig({
		simplemocha: {
			test: {
				src: 'test/test.js'
			}
		},
		watch: {
			test: {
				files: [
					'noop'
				]
			}
		},
		php: {
			open: {
				options: {
					port: 7007,
					base: 'test',
					keepAlive: true,
					open: true
				}
			},
			openUrl: {
				options: {
					port: 7008,
					base: 'test',
					keepAlive: true,
					open: '200/index2.php'
				}
			},
			test200: {
				options: {
					port: 8008,
					base: 'test/200'
				}
			},
			test301: {
				options: {
					port: 8009,
					base: 'test/301'
				}
			},
			test400: {
				options: {
					port: 8010,
					base: 'test/400'
				}
			},
			test404: {
				options: {
					port: 8011,
					base: 'test/404'
				}
			},
			test500: {
				options: {
					port: 8020,
					base: 'test/500'
				}
			},
			testEnv: {
				options: {
					port: 8021,
					base: 'test/env',
					env: {
						FOOBAR: 'foobar'
					}
				}
			},
			testDirectives: {
				options: {
					port: 8022,
					base: 'test/directives',
					directives: {
						'error_log': 'foobar'
					}
				}
			},
			serve: {
				options: {
					port: 9000,
					base: 'test/browsersync'
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
		'php:testDirectives',
		'simplemocha:test'
	]);
};
