module.exports = (function(){
	"use strict";
	var _fs = require("fs")
		, _path = require("path")
		, _clog = require("clog")
		, _filename = ".migrationTracker";

	/**
	 * Writes a new migration tracker file.
	 * @private 
	 * @param {string} path The directory or path in which the tracker file will be created.
	 * @param {string} currentFile The file name of the current migration version.
	 */
	var _createTrackerFile = function(path, currentFile){
		var trackerLocation = path + '/' + _filename;
		_fs.writeFileSync(trackerLocation, currentFile);
	};
	
	/**
	 * Reads the contents of the tracker file.
	 * @private 
	 * @param {string} path The directory or path in which the tracker file will be created.
	 * @returns {string} The file name of the current migration version from within the tracker file.  If not located, will return '0'.
	 */
	var _readTrackerFile = function(path){
		var trackerLocation = path + '/' + _filename;
		if (!_path.existsSync(trackerLocation)){
			_clog.debug("* Migration Tracker file not found");
			_clog.debug("* in '" + trackerLocation + "'.");
			return "0";
		} 
		
		return _fs.readFileSync(trackerLocation, "utf8");
	};
	
	/**
	 * Sets the migration version in the tracker file.
	 * @private
	 * @param {string} path The directory or path in which the tracker file will be created.
	 * @param {string} file The file name of the current migration version.
	 */
	var _setTrackerFile = function(path, file){
		var trackerLocation = path + '/' + _filename;
		if (_path.existsSync(trackerLocation)){
			_fs.unlinkSync(trackerLocation);
		}
		
		_createTrackerFile(path, file);
	};

	// export definition
	return {
		getCurrentVersion: _readTrackerFile
		, setCurrentVersion: _setTrackerFile
	};
}());
