module.exports = (function(){
	"use strict";
	var _compat = require("../utils/node06compat")
		, _path = require("path")
		, _fs = require("fs")
		, _clog = require("clog")
		, _requiredir = require("requiredir")
		, _benchmarkTimer = require("../utils/benchmarkTimer")
		, _tracker = require("../utils/migration_version_tracker")
		, _migrationExists = false
		, _migration
		, _migrationsDirectory
		, _startTime
		, _endTime
		, _currentVersion
		, _migrationArray
		, _newVersion
		, _script
		, _callback;


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
	 * Verifies if an optional migration file was passed into the command.
	 * @private 
	 * @param {string} migration The name of the migration to identify.
	 */
	var _verifyOptionalMigrationProvided = function(migration){
		if (typeof migration === "undefined"){
			_clog.debug("No migration specified");
			return false;
		}
		
		_clog.debug("Migration specified - '" + migration + "'");
		
		return true;
	};

	/**
	 * Verifies if an optional migration file exists in the migrations directory.
	 * @private 
	 * @param {string} path The directory or path to search.
	 * @param {string} migration The name of the migration to identify.
	 */
	var _verifyOptionalMigration = function(path, migration){

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
	var _sortMigrationsAscending = function(a, b){
		return a.name.substring(0,14) - b.name.substring(0,14);
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
			|| (_migrationExists && _migrationArray[idx].name.substring(0,14) > _migration.substring(0,14))) { 
				_finalizeCommand();
				return;
			}
		
		_script = _migrationArray[idx];
		if (_script.name.substring(0,14) > _currentVersion){
			try{
				_clog.log("Migrating To: " + _script.name);
				_script.up(_migrationScriptFinished);
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
	var _finalizeCommand = function(err){
		if (typeof err === "undefined"){
			if (typeof _newVersion !== "undefined"){
				_tracker.setCurrentVersion(_migrationsDirectory, _newVersion);
			} else {
				_clog.log("You are currently at the most recent migration.");
			}
		}
		
		_clog.log("Migration Complete!");
		_endTime = _benchmarkTimer.getBenchmarkTime();
		_clog.log("(" + (_endTime - _startTime) + "ms)");
		if (typeof _callback === "function") {_callback();}
	};
	

	/**
	 * Exports a function that will migrate the scripts up.
	 * @public 
	 * @param {string} migration The optional migration file to which to migrate.  If migreation is not provide all new migrations will be ran.
	 * @param {function} callback The optional callback to be called once the command is finished.
	 */
	var _command = function(migration, callback) {
		_callback = callback;
		_startTime = _benchmarkTimer.getBenchmarkTime();
		_migration = migration;
		_migrationExists = false;
		
		_migrationsDirectory = _path.resolve(process.cwd() + "/migrations");
		
		if(!_verifyMigrationsDirectory(_migrationsDirectory)){
			_clog.error("Unable to continue proceed.");
			_endTime = _benchmarkTimer.getBenchmarkTime();
			_clog.log("(" + (_endTime - _startTime) + "ms)");
			_finalizeCommand("Migration Directory not found.");
			return;
		}
		
		
		if (_verifyOptionalMigrationProvided(migration)){
			if(!_verifyOptionalMigration(_migrationsDirectory, migration)){
				_clog.error("Unable to continue proceed.");
				_endTime = _benchmarkTimer.getBenchmarkTime();
				_clog.log("(" + (_endTime - _startTime) + "ms)");
				_finalizeCommand("Specified migration not found.");
				return;
			} else {
				_migrationExists = true;
			}
		}
		
		_currentVersion = _getCurrentVersion(_migrationsDirectory);
		var migrations = _requiredir("./migrations");
		
		_migrationArray = migrations.toArray()
							.sort(_sortMigrationsAscending);
		
		_clog.log(migrations.length + " migration scripts located.");
		_clog.log("Current Version: " + _currentVersion);
		

		index = 0;
		_executeMigration(index);
	};	
	
	return _command;
}());
