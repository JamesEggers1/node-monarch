"use strict";

var _fs = require("fs")
	, _path = require("path")
	, _rimraf = require("rimraf")
	, _eol = require("../src/utils/eol")
	, _template =[
			''
			, 'exports.name = "{{filename}}";'
			, ''
			, 'exports.up = function(logger){'
			, 'logger.test("{{filename}} was migrated up.");'
			, '};'
			, ''
			, 'exports.down = function(logger){'
			, 'logger.test("{{filename}} was migrated up.");'
			, '};'
		].join(_eol);
	
/**
 * Verifies that a directory exists relative to the current working directory.
 * @param {string} relativePath The relative path to verify.
 * @returns {boolean} Returns true if the directory exists relative to the current working directory.
 */
module.exports.relativeDirectoryExists = function(relativePath) {
	var relativeDirectory = _path.resolve(process.cwd() + "/" + relativePath);
	return _path.existsSync(relativeDirectory);
};

/**
 * Deletes a directory relative to the current working directory and all of its contents.
 * @param {string} relativePath The relative path to verify.
 */
module.exports.deleteRelativeDirectory = function(relativePath) {
	var relativeDirectory = _path.resolve(process.cwd() + "/" + relativePath);
	_rimraf.sync(relativeDirectory);
};

/**
 * Verifies that a file exists relative to the current working directory.
 * @param {string} relativeFilePath The relative file path to verify.
 * @returns {boolean} Returns true if the file exists relative to the current working directory.
 */
module.exports.relativeFileExists = function(relativeFilePath){
	var relativeFile = _path.resolve(process.cwd() + "/" + relativeFilePath);
	return _path.existsSync(relativeFile);
};

/**
 * Creates a directory relative to the current working directory if it does not already exist.
 * @param {string} relativeDirectoryPath The relative path to create.
 */
module.exports.createRelativeDirectory = function (relativeDirectoryPath){
	var relativeDirectory = _path.resolve(process.cwd() + "/" + relativeDirectoryPath);
	
	if(!_path.existsSync(relativeDirectory)){
		_fs.mkdirSync(relativeDirectory);
	}
};

module.exports.createMigrationTrackerFile = function(path, content){
	var filename = ".migrationTracker";
	var relativeDirectory = _path.resolve(process.cwd() + "/" + path);
	
	if(!_path.existsSync(relativeDirectory)){
		_fs.mkdirSync(relativeDirectory);
	}
	
	_fs.writeFileSync(path + '/' + filename, content);
};

module.exports.upMigrationSetup = function(path, count){
	var relativeDirectory = _path.resolve(process.cwd() + "/" + path)
		, filename
		, template;
	
	if(!_path.existsSync(relativeDirectory)){
		_fs.mkdirSync(relativeDirectory);
	}
		
	for (var i = 0; i <  count; i++){
		filename = "2012063017470" + i + ".js";
		template = _template.replace(/\{\{filename\}\}/g, filename);
		_fs.writeFileSync(path + '/' + filename, template);
	}
};


module.exports.downMigrationSetup = function(path, count){
	var relativeDirectory = _path.resolve(process.cwd() + "/" + path)
		, filename
		, template;
	
	if(!_path.existsSync(relativeDirectory)){
		_fs.mkdirSync(relativeDirectory);
	}
		
	for (var i = 0; i <  count; i++){
		filename = "2012063017470" + i + ".js";
		template = _template.replace(/\{\{filename\}\}/g, filename);
		_fs.writeFileSync(path + '/' + filename, template);
	}
};