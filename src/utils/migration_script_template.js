module.exports = (function(){
	"use strict";

	var _eol = require("./eol")
		, _template =[
			''
			, 'exports.name = "{{filename}}";'
			, ''
			, 'exports.up = function(logger){'
			, ''
			, '};'
			, ''
			, 'exports.down = function(logger){'
			, ''
			, '};'
		].join(_eol);


	return _template;	
}());
