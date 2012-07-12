module.exports = (function(){
	"use strict";
	var _path = require("path")
		, _fs = require("fs")
		, _clog = require("clog")
		, _requiredir = require("requiredir")
		, _benchmarkTimer = require("../utils/benchmarkTimer")
		, _tracker = require("../utils/migration_version_tracker")
		, _migrationsDirectory
		, _callback
		, _startTime
		, _endTime
		, _newVersion
		, _migration
		, _currentVersion
		, _script
		, _migrationArray;


	/**
	 * Verifies the migrations directory.
	 * @private 
	 * @param {string} path The directory or path to verify.
	 */
	var _verifyMigrationsDirectory = function(path){
		if (!_fs.existsSync(path)){
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

		if (!_fs.existsSync(path + "/" + migration)){
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
	
	var index = 0;
	var _executeMigration = function(idx){
		if (index >= _migrationArray.length
			|| (_migrationArray[idx].name.substring(0,14) <= _migration.substring(0,14))) { 
				_finalizeCommand();
				return;
			}
		
		_script = _migrationArray[idx];
		if (_script.name.substring(0,14) <= _currentVersion
			&& _script.name.substring(0,14) > _migration.substring(0,14)){
			try{
				_clog.log("Reverting: " + _script.name);
				_script.down(_migrationScriptFinished);
				return;
			} catch (e) {
				_clog.error("*******************************************************");
				_clog.error("* " + e.name + ": " + e.message);
				_clog.error("* Migrations will be halted.");
				_clog.error("*******************************************************");
				_finalizeCommand();
				return;
			}
		} else {
			_executeMigration(++index);
		}
	};
	
	/**
	 * Universal callback for when migration scripts finish.
	 * @private 
	 * @param {object} err An error that could have been raised during the migration.
	 */
	var _migrationScriptFinished = function(err){
		if (typeof err !== "undefined"){
			_clog.error(err);
			_finalizeCommand();
		}
		
		// emit event to trigger the next migration.
		_newVersion = _migrationArray[index].name;
		_executeMigration(++index);
	};
	
	/**
	 * Final output logging of the command's events.
	 * @private 
	 */
	var _finalizeCommand = function(){
		if (typeof _newVersion !== "undefined"){
			_tracker.setCurrentVersion(_migrationsDirectory, _newVersion);
		} else {
			_clog.log("No migrations were ran at this time.");
		}
		
		_clog.log("Migration Complete!");
		_endTime = _benchmarkTimer.getBenchmarkTime();
		_clog.log("(" + (_endTime - _startTime) + "ms)");
		if (typeof _callback === "function") {_callback();}
	};

	/**
	 * Exports a function that will migrate the scripts down.
	 * @public 
	 * @param {string} migration The required migration file or version to which to migrate.
	 */
	var _command = function(migration, callback) {
		_startTime = _benchmarkTimer.getBenchmarkTime();
		_callback = callback;
		
		_migration = migration;
		if (typeof migration === "number"){
			_migration = migration.toString();
		} 

		_migrationsDirectory = _path.resolve(process.cwd() + "/migrations");
		
		if(!_verifyMigrationsDirectory(_migrationsDirectory)){
			_clog.error("Unable to continue proceed.");
			_endTime = _benchmarkTimer.getBenchmarkTime();
			_clog.log("(" + (_endTime - _startTime) + "ms)");
			_finalizeCommand("Migration Directory not found.");
			return;
		}
		
		if(!_verifyMigrationExists(_migrationsDirectory, migration)){
			_clog.error("Unable to continue proceed.");
			_endTime = _benchmarkTimer.getBenchmarkTime();
			_clog.log("(" + (_endTime - _startTime) + "ms)");
			_finalizeCommand("Specified migration not found.");
			return;
		} 
		
		_currentVersion = _getCurrentVersion(_migrationsDirectory);
		var migrations = _requiredir("./migrations");
		
		_migrationArray = migrations.toArray()
							.sort(_sortMigrationsDescending);
		
		_clog.log(migrations.length + " migration scripts located.");
		_clog.log("Current Version: " + _currentVersion);
		
		index = 0;
		_executeMigration(index);
	};	
	
	return _command;
}());
