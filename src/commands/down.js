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
	 * Verifies if an optional migration file exists in the migrations directory.
	 * @private 
	 * @param {string} path The directory or path to search.
	 * @param {string} migration The name of the migration to identify.
	 */
	var _verifyMigrationExists = function(path, migration){
		
		if (typeof migration === "undefined"){
			_clog.error("*******************************************************");
			_clog.error("* A migration version must be specified to migrate down.");
			_clog.error("* If you wish to completely roll back to initial schema, migrate to 0.");
			_clog.error("*******************************************************");
			return false;
		}
		
		if (migration === "0"){return true;}

		if (!_path.existsSync(path + "/" + migration)){
			_clog.error("*******************************************************");
			_clog.error("* Migration '" + migration + "' does not exist");
			_clog.error("* - in " + path);
			_clog.error("*******************************************************");
			return false;
		}
		
		_clog.debug("Migration found");
		
		return true;
	};
	
	/**
	 * Sorts the migrations array in ascending order
	 * @private 
	 * @param {object} a The first object to compare.
	 * @param {object} b The second object to compare.
	 */
	var _sortMigrationsDescending = function(a, b){
		return b.name.substring(0,14) - a.name.substring(0,14);
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
	 * Exports a function that will migrate the scripts down.
	 * @public 
	 * @param {string} migration The required migration file or version to which to migrate.
	 */
	var _command = function(migration) {
		var startTime = _benchmarkTimer.getBenchmarkTime();
		var endTime;
		
		console.log('');
		var migrationsDirectory = _path.resolve(process.cwd() + "/migrations");
		
		if(!_verifyMigrationsDirectory(migrationsDirectory)){
			console.log("");
			_clog.error("Unable to continue proceed.");
			endTime = _benchmarkTimer.getBenchmarkTime();
			_clog.log("(" + (endTime - startTime) + "ms)");
			return;
		}
		
		if(!_verifyMigrationExists(migrationsDirectory, migration)){
			console.log("");
			_clog.error("Unable to continue proceed.");
			endTime = _benchmarkTimer.getBenchmarkTime();
			_clog.log("(" + (endTime - startTime) + "ms)");
			return;
		} 
		
		var currentVersion = _getCurrentVersion(migrationsDirectory);
		var migrations = _requiredir("./migrations");
		var newVersion;
		var script;
		var i;
		var len;
		
		var migrationArray = migrations.toArray()
							.sort(_sortMigrationsDescending);
		
		_clog.log(migrations.length + " migration scripts located.");
		_clog.log("Current Version: " + currentVersion);
		
		for (i = 0, len = migrationArray.length; i < len; i++){
			script = migrationArray[i];
			if (script.name.substring(0,14) > currentVersion){continue;}
			if (script.name.substring(0,14) <= migration.substring(0,14)){break;}
			if (script.name.substring(0,14) <= currentVersion
				&& script.name.substring(0,14) > migration.substring(0,14)){
				newVersion = script.name;
				_clog.log("Reverting: " + newVersion);
				script.down(_clog);
			}
		}
		
		if (i === len){newVersion = 0;}
		
		console.log("");
		if (typeof newVersion !== "undefined"){
			_tracker.setCurrentVersion(migrationsDirectory, newVersion);
		} else {
			_clog.log("No migrations were ran at this time.");
		}
		
		_clog.log("Migration Complete!");
		endTime = _benchmarkTimer.getBenchmarkTime();
		_clog.log("(" + (endTime - startTime) + "ms)");
		console.log('');
	};	
	
	return _command;
}());
