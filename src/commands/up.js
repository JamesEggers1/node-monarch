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

	/**
	 * Exports a function that will migrate the scripts up.
	 * @public 
	 * @param {string} migration The optional migration file to which to migrate.  If migreation is not provide all new migrations will be ran.
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
		
		var migrationExists = false;
		if (_verifyOptionalMigrationProvided(migration)){
			if(!_verifyOptionalMigration(migrationsDirectory, migration)){
				console.log("");
				_clog.error("Unable to continue proceed.");
				endTime = _benchmarkTimer.getBenchmarkTime();
				_clog.log("(" + (endTime - startTime) + "ms)");
				return;
			} else {
				migrationExists = true;
			}
		}
		
		var currentVersion = _getCurrentVersion(migrationsDirectory);
		var migrations = _requiredir("./migrations");
		var newVersion;
		var script;
		
		var migrationArray = migrations.toArray()
							.sort(_sortMigrationsAscending);
		
		_clog.log(migrations.length + " migration scripts located.");
		_clog.log("Current Version: " + currentVersion);
		
		for (var i = 0, len = migrationArray.length; i < len; i++){
			script = migrationArray[i];
			if (migrationExists && script.name.substring(0,14) > migration.substring(0,14)){break;}
			if (script.name.substring(0,14) > currentVersion){
				newVersion = script.name;
				_clog.log("Migrating To: " + newVersion);
				script.up(_clog);
			}
		}
		
		console.log("");
		if (typeof newVersion !== "undefined"){
			_tracker.setCurrentVersion(migrationsDirectory, newVersion);
		} else {
			_clog.log("You are currently at the most recent migration.");
		}
		
		_clog.log("Migration Complete!");
		endTime = _benchmarkTimer.getBenchmarkTime();
		_clog.log("(" + (endTime - startTime) + "ms)");
		console.log('');
	};	
	
	return _command;
}());
