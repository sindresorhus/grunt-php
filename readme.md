# grunt-php [![Build Status](https://travis-ci.org/sindresorhus/grunt-php.svg?branch=master)](https://travis-ci.org/sindresorhus/grunt-php)

> Start a [PHP server](https://php.net/manual/en/features.commandline.webserver.php)

Useful for developing PHP projects or running tests on them.

Pretty much a drop-in replacement for [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect), except for the `middleware` option.

Uses the PHP built-in server.


## Install

```
$ npm install --save-dev grunt-php
```


## Usage

```js
require('load-grunt-tasks')(grunt);

grunt.initConfig({
	php: {
		dist: {
			options: {
				port: 5000
			}
		}
	}
});

grunt.registerTask('default', ['php']);
```


## Examples

#### Start a persistent PHP server and open in browser

```js
grunt.initConfig({
	php: {
		test: {
			options: {
				keepAlive: true,
				open: true
			}
		}
	}
});

grunt.registerTask('test', ['php', 'mocha']);
```

#### Use it with [BrowserSync](http://www.browsersync.io)

```js
grunt.initConfig({
	php: {
		dist: {
			options: {
				port: 9000,
				base: 'dist' // Project root
			}
		}
	},
	browserSync: {
		dist: {
			bsFiles: {
				src: [
					// Files you want to watch for changes
				]
			},
			options: {
				proxy: '<%= php.dist.options.hostname %>:<%= php.dist.options.port %>',
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
	},
	watch: {
		// Your watch tasks
	}
});

grunt.registerTask('serve', [
	'php:dist',         // Start PHP Server
	'browserSync:dist', // Using the PHP instance as a proxy
	'watch'             // Any other watch tasks you want to run
]);
```

#### Use it with [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)

```js
grunt.initConfig({
	php: {
		watch: {}
	}
});

grunt.registerTask('phpwatch', ['php:watch', 'watch']);
```

#### Add path for a custom error log

```js
const path = require('path');

grunt.initConfig({
	php: {
		dist: {
			options: {
				directives: {
					'error_log': path.resolve('logs/error.log')
				}
			}
		}
	}
});

grunt.registerTask('default', ['php']);
```

## Options

Supports all the [`php-server` options](https://github.com/sindresorhus/php-server#options) in addition to the ones below.

### keepAlive

Type: `boolean`<br>
Default: `false`

Keep the server alive indefinitely. Any task specified after this will not run.

This option can also be enabled ad-hoc by running the task like `grunt php:targetname:keepAlive`.

### silent

Type: `boolean`<br>
Default: `false`

Suppress output produced by the PHP server.


## Related

- [php-server](https://github.com/sindresorhus/php-server) - Start a PHP server from Node.js


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
