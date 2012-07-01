"use strict";

var _clog = require("clog");

module.exports.default = function(){
	_clog.configure({
		'log level': {
			'log': true,
			'info': false,
			'warn': true,
			'error': true,
			'debug': false
		}
	});
};

module.exports.debug = function(){
	_clog.configure({
		'log level': {
			'log': true,
			'info': false,
			'warn': true,
			'error': true,
			'debug': true
		}
	});
};

module.exports.all = function(){
	_clog.configure({
		'log level': {
			'log': true,
			'info': true,
			'warn': true,
			'error': true,
			'debug': true
		}
	});
};

module.exports.none = function(){
	_clog.configure({
		'log level': {
			'log': false,
			'info': false,
			'warn': false,
			'error': false,
			'debug': false
		}
	});
};