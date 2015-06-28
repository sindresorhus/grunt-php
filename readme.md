# grunt-php [![Build Status](https://travis-ci.org/sindresorhus/grunt-php.svg?branch=master)](https://travis-ci.org/sindresorhus/grunt-php)

> Start a [PHP-server](http://php.net/manual/en/features.commandline.webserver.php)

Pretty much a drop-in replacement for [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect). Useful for eg. developing PHP projects or running tests on it.

Uses the built-in server in PHP 5.4.0+.

*Doesn't have a `middleware` option as grunt-contrib-connect does.*


## Install

```
$ npm install --save-dev grunt-php
```


## Usage

```js
require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

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

#### Start a persistent PHP-server and open in browser

```js
grunt.initConfig({
	php: {
		test: {
			options: {
				keepalive: true,
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
				hostname: '127.0.0.1',
				port: 9000,
				base: 'dist', // Project root
				keepalive: false,
				open: false
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
	'browserSync:dist', // Using the php instance as a proxy
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
grunt.initConfig({
	php: {
		dist: {
			options: {
				directives: {
					'error_log': require('path').resolve('logs/error.log')
				}
			}
		}
	}
});

grunt.registerTask('default', ['php']);
```

## Options

### port

Type: `number`  
Default: `8000`

The port on which you want to access the webserver. Task will fail if the port is already in use. Use the special value `?` to use a system-assigned port.

### hostname

Type: `string`  
Default: `'127.0.0.1'` *(usually same as `localhost`)*

The hostname the webserver will use.

Use `0.0.0.0` if you want it to be accessible from the outside.

### base

Type: `string`  
Default: `'.'`

From which folder the webserver will be served. Defaults to the directory of the Gruntfile.

### keepalive

Type: `boolean`  
Default: `false`

Keep the server alive indefinitely. Any task specified after this will not run.

This option can also be enabled ad-hoc by running the task like `grunt php:targetname:keepalive`

### open

Type: `boolean` or `string`
Default: `false`

Open a browser when task is triggered.

Can be one of the following:

- `true`: opens the default server URL ('http://' + hostname + port)
- a relative URL (string): opens that URL in the browser. Useful when testing pages that are not the default one.

### router

Type: `string`  

Optionally specify the path to a [router script](http://php.net/manual/en/features.commandline.webserver.php#example-380) that is run at the start of each HTTP request. If this script returns `false`, then the requested resource is returned as-is. Otherwise the script's output is returned to the browser.

Example router script:

```php
<?php
// router.php
if (preg_match('/\.(?:png|jpg|jpeg|gif)$/', $_SERVER["REQUEST_URI"])) {
	return false;    // serve the requested resource as-is
} else {
	echo "<p>Thanks for using grunt-php :)</p>";
}
?>
```

### bin

Type: `string`  
Default: `'php'`

Path to the PHP binary. Useful if you have multiple versions of PHP installed.

### ini

Type: `string`  
Default: Built-in `php.ini`

Path to a custom [`php.ini`](http://php.net/manual/en/ini.php) config file.

### silent

Type: `boolean`  
Default: `false`

Suppress output produced by the PHP-server.

### directives

Type: `object`  
Default: `{}`

Add custom [ini directives](http://php.net/manual/en/ini.list.php).

### env

Type: `object`  
Default: `{}`

Set environment variables for the PHP process.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
