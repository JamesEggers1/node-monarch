module.exports = (function(){
	"use strict";
	var _path = require("path")
		, _fs = require("fs")
		, _clog = require("clog")
		, _requiredir = require("requiredir")
		, _benchmarkTimer = require("../utils/benchmarkTimer")
		, _tracker = require("../utils/migration_version_tracker");


	/**
	 * Verifies the migrations directory.
	 * @private 
	 * @param {string} path The directory or path to verify.
	 */
	var _verifyMigrationsDirectory = function(path){
		if (!_path.existsSync(path)){
			_clog.error("*******************************************************");
			_clog.error("* Migrations directory not found.");
			_clog.error("* " + path);
			_clog.error("*******************************************************");
			return false;
		} 
		
		_clog.debug("Migrations directory exists at '" + path + "'.");
		return true;
	};
	
	/**
	 * Retrieves the current version of the migrations and reports just the version number.
	 * @private 
	 * @param {string} path The migrations directory path.
	 * @returns {string} The version number of the current migration version.
	 */
	var _getCurrentVersion = function(path){
		var currentVersion = _tracker.getCurrentVersion(path);
		
		if (currentVersion !== "0"){
			currentVersion = currentVersion.substring(0,14);
		}
		
		return currentVersion;
	};

	/**
	 * Exports a function that will provide the current migration status.
	 * @public 
	 */
	var _command = function() {
		var startTime = _benchmarkTimer.getBenchmarkTime();
		var endTime;
		
		console.log('');
		var migrationsDirectory = _path.resolve(process.cwd() + "/migrations");
		
		if(!_verifyMigrationsDirectory(migrationsDirectory)){
			console.log("");
			_clog.error("Current Version: 0");
			endTime = _benchmarkTimer.getBenchmarkTime();
			_clog.log("(" + (endTime - startTime) + "ms)");
			return;
		}
		
		var currentVersion = _getCurrentVersion(migrationsDirectory);
		
		_clog.log("Current Version: " + currentVersion);
		endTime = _benchmarkTimer.getBenchmarkTime();
		_clog.log("(" + (endTime - startTime) + "ms)");
		console.log('');
	};	
	
	return _command;
}());
