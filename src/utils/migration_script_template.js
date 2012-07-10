module.exports = (function(){
	"use strict";

	var _eol = require("./eol")
		, _template =[
			''
			, 'exports.name = "{{filename}}";'
			, ''
			, 'exports.up = function(done){'
			, ''
			, 'done();'
			, '};'
			, ''
			, 'exports.down = function(done){'
			, ''
			, 'done();'
			, '};'
		].join(_eol);


	return _template;	
}());
