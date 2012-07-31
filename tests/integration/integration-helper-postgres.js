module.exports = (function(){
	"use strict";

	var _fs = require("fs")
		, _path = require("path")
		, _eol = require("../../src/utils/eol")
		, _i = 0;

	var _template = [
			''
			, 'var pg = require("pg");'
			, 'var conString = "tcp://postgres:password@localhost/pgtest1";'
			, ''
			, 'exports.name = "{{filename}}";'
			, ''
			, 'exports.up = function(done){'
			, '		var client = new pg.Client(conString);'
			, '		client.connect();'
			, '		client.query("CREATE TABLE {{tablename}} (name varchar(50), age int)");'
			, ''
			, '		client.on("end", function(){'
			, '			client.end();'
			, '			done();'
			, '		});'
			, '};'
			, ''
			, 'exports.down = function(done){'
			, '		var client = new pg.Client(conString);'
			, '		client.connect();'
			, '		client.query("DROP TABLE {{tablename}}");'
			, ''
			, '		client.on("end", function(){'
			, '			client.end();'
			, '			done();'
			, '		});'
			, '};'
		].join(_eol);
	
	var createMigrationScript = function(tableName){
		var relativeDirectory = _path.resolve(process.cwd() + "/migrations")
			, template
			, filename;

		if(!_fs.existsSync(relativeDirectory)){
			_fs.mkdirSync(relativeDirectory);
		}

		filename = "2012063017470" + _i + "-Create_" + tableName + ".js";
		template = _template.replace(/\{\{filename\}\}/g, filename);
		template = template.replace(/\{\{tablename\}\}/g, tableName);
		_fs.writeFileSync(relativeDirectory + '/' + filename, template);
		_i++;
	};
	
	return {
		createMigrationScript: createMigrationScript
	};
}());