module.exports = (function(){
	"use strict";

	var _compat = require("../src/utils/node06compat")
		, _fs = require("fs")
		, _path = require("path")
		, _rimraf = require("rimraf")
		, _eol = require("../src/utils/eol")
		, _template =[
				''
				, 'var _clog = require("clog");'
				, 'exports.name = "{{filename}}";'
				, ''
				, 'exports.up = function(done){'
				, '_clog.test("{{filename}} was migrated up.");'
				, 'done()'
				, '};'
				, ''
				, 'exports.down = function(done){'
				, '_clog.test("{{filename}} was migrated down.");'
				, 'done();'
				, '};'
			].join(_eol)
		, _asyncTemplate =[
				''
				, 'var _clog = require("clog");'
				, 'exports.name = "{{filename}}";'
				, ''
				, 'var tmpUp = function(cb){'
				, '_clog.test("{{filename}} was migrated up.");'
				, 'cb();'
				, '};'
				, ''
				, 'var tmpDown = function(cb){'
				, '_clog.test("{{filename}} was migrated down.");'
				, 'cb();'
				, '};'
				, ''
				, 'exports.up = function(done){'
				, 'setTimeout(tmpUp, 1, done);'
				, '};'
				, ''
				, 'exports.down = function(done){'
				, 'setTimeout(tmpDown, 1, done);'
				, '};'
			].join(_eol)
		, _errorTemplate =[
				''
				, 'exports.name = "{{filename}}";'
				, ''
				, 'exports.up = function(done){'
				, 'try {'
				, 'throw new Error("Migration Exception");'
				, '} catch (err) {'
				, 'done(err);'
				, '}'
				, '};'
				, ''
				, 'exports.down = function(done){'
				, 'try {'
				, 'throw new Error("Migration Exception");'
				, '} catch (err) {'
				, 'done(err);'
				, '}'
				, '};'
			].join(_eol);

	/**
	 * Verifies that a directory exists relative to the current working directory.
	 * @param {string} relativePath The relative path to verify.
	 * @returns {boolean} Returns true if the directory exists relative to the current working directory.
	 */
	var relativeDirectoryExists = function(relativePath) {
		var relativeDirectory = _path.resolve(process.cwd() + "/" + relativePath);
		return _fs.existsSync(relativeDirectory);
	};

	/**
	 * Deletes a directory relative to the current working directory and all of its contents.
	 * @param {string} relativePath The relative path to verify.
	 */
	var deleteRelativeDirectory = function(relativePath) {
		var relativeDirectory = _path.resolve(process.cwd() + "/" + relativePath);
		_rimraf.sync(relativeDirectory);
	};

	/**
	 * Verifies that a file exists relative to the current working directory.
	 * @param {string} relativeFilePath The relative file path to verify.
	 * @returns {boolean} Returns true if the file exists relative to the current working directory.
	 */
	var relativeFileExists = function(relativeFilePath){
		var relativeFile = _path.resolve(process.cwd() + "/" + relativeFilePath);
		return _fs.existsSync(relativeFile);
	};

	/**
	 * Creates a directory relative to the current working directory if it does not already exist.
	 * @param {string} relativeDirectoryPath The relative path to create.
	 */
	var createRelativeDirectory = function (relativeDirectoryPath){
		var relativeDirectory = _path.resolve(process.cwd() + "/" + relativeDirectoryPath);

		if(!_fs.existsSync(relativeDirectory)){
			_fs.mkdirSync(relativeDirectory);
		}
	};

	var createMigrationTrackerFile = function(path, content){
		var filename = ".migrationTracker";
		var relativeDirectory = _path.resolve(process.cwd() + "/" + path);

		if(!_fs.existsSync(relativeDirectory)){
			_fs.mkdirSync(relativeDirectory);
		}

		_fs.writeFileSync(path + '/' + filename, content);
	};

	var upMigrationSetup = function(path, count){
		var relativeDirectory = _path.resolve(process.cwd() + "/" + path)
			, filename
			, template;

		if(!_fs.existsSync(relativeDirectory)){
			_fs.mkdirSync(relativeDirectory);
		}

		for (var i = 0; i <  count; i++){
			filename = "2012063017470" + i + ".js";
			template = _template.replace(/\{\{filename\}\}/g, filename);
			_fs.writeFileSync(path + '/' + filename, template);
		}
	};


	var downMigrationSetup = function(path, count){
		var relativeDirectory = _path.resolve(process.cwd() + "/" + path)
			, filename
			, template;

		if(!_fs.existsSync(relativeDirectory)){
			_fs.mkdirSync(relativeDirectory);
		}

		for (var i = 0; i <  count; i++){
			filename = "2012063017470" + i + ".js";
			template = _template.replace(/\{\{filename\}\}/g, filename);
			_fs.writeFileSync(path + '/' + filename, template);
		}
	};
	
	var errorMigrationSetup = function(path, count){
		var relativeDirectory = _path.resolve(process.cwd() + "/" + path)
			, filename
			, template;

		if(!_fs.existsSync(relativeDirectory)){
			_fs.mkdirSync(relativeDirectory);
		}

		for (var i = 0; i <  count; i++){
			filename = "2012063017471" + i + ".js";
			template = _errorTemplate.replace(/\{\{filename\}\}/g, filename);
			_fs.writeFileSync(path + '/' + filename, template);
		}
	};
	
	var asyncMigrationSetup = function(path, count){
		var relativeDirectory = _path.resolve(process.cwd() + "/" + path)
			, filename
			, template;

		if(!_fs.existsSync(relativeDirectory)){
			_fs.mkdirSync(relativeDirectory);
		}

		for (var i = 0; i <  count; i++){
			filename = "2012063017472" + i + ".js";
			template = _asyncTemplate.replace(/\{\{filename\}\}/g, filename);
			_fs.writeFileSync(path + '/' + filename, template);
		}
	};
	
	return {
		relativeDirectoryExists : relativeDirectoryExists
		, deleteRelativeDirectory : deleteRelativeDirectory
		, relativeFileExists : relativeFileExists
		, createRelativeDirectory : createRelativeDirectory
		, createMigrationTrackerFile : createMigrationTrackerFile
		, upMigrationSetup : upMigrationSetup
		, downMigrationSetup : downMigrationSetup
		, errorMigrationSetup : errorMigrationSetup
		, asyncMigrationSetup : asyncMigrationSetup
	};
}());
