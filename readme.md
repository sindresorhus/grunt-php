# grunt-php [![Build Status](https://travis-ci.org/sindresorhus/grunt-php.svg?branch=master)](https://travis-ci.org/sindresorhus/grunt-php)

> Start a [PHP-server](http://php.net/manual/en/features.commandline.webserver.php)

Pretty much a drop-in replacement for [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect). Useful for eg. running tests on a PHP project.

Uses the built-in server in PHP 5.4.0+.

*Doesn't have a `middleware` option as grunt-contrib-connect does.*


## Install

```sh
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

#### Use it with [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)

```js
grunt.initConfig({
	php: {
		watch: {}
	}
});

grunt.registerTask('phpwatch', ['php:watch', 'watch']);
```


## Options

### port

Type: `number`  
Default: `8000`

The port on which you want to access the webserver. Task will fail if the port is already in use.

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

Type: `boolean`  
Default: `false`

Open the server in the browser when the task is triggered.

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

### binVersion

Type: `string`
Default: `>=5.4`

Version your PHP binary must satisfy.
Update if your code requires higher version, or if you have version errors (for example, on ubuntu php reports `5.5.9-1ubuntu4.4` which fails the default check `>=5.4` due to [semver semantics](https://github.com/npm/node-semver/pull/99#issuecomment-55044058) - set to `*` in this case).

### ini

Type: `string`  
Default: Built-in `php.ini`

Path to a custom [`php.ini`](http://php.net/manual/en/ini.php) config file.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
