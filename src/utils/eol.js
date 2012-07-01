module.exports = (function(){
	"use strict";
	var _os = require('os');

	return _os.platform
		? ('win32' == _os.platform() ? '\r\n' : '\n')
		: '\n';	
}());
