"use strict";

var _timestamp = require("../src/utils/timestamp")
	, _mocha = require("mocha")
	, _should = require("should")
	, _status = require("../src/commands/status")
	, _helper = require("./test-helper")
	, _clog = require("clog")
	, _clogConfig = require("../configs/clog-config").none();
	
describe("Status Command", function(){
	describe("Error Cases", function(){
		it("should output an error if the migrations directory does not exist.", function(){
			var errorWasCalled = false;
			_clog.error = function(){ errorWasCalled = true;};
			
			_status();
			errorWasCalled.should.be.true;
		});
	});
	
	describe("Getting Current Version", function(){
		var count = 3
			, path = "./migrations";
			
		beforeEach(function(done){
			_helper.upMigrationSetup(path, count);
			done();
		});
	
		afterEach(function(done){
			_helper.deleteRelativeDirectory(path);
			done();
		});
		
		it("should report a current version of 0 if tracker file is not present.", function(){
			var currentVersion;
			_clog.log = function(str){
				var isMatch = str.match(/^Current Version\: ([0-9]*)$/);
				if (isMatch){
					currentVersion = isMatch[1];
				}
			};
			
			_status();
			currentVersion.should.equal("0");
		});
		
		it("should migrate to the latest version if newer than current version.", function(){
			var currentVersion;
			_clog.log = function(str){
				var isMatch = str.match(/^Current Version\: ([0-9]+)$/);
				if (isMatch){
					currentVersion = isMatch[1];
				}
			};
			
			_helper.createMigrationTrackerFile(path, "20120630174700.js");
			
			_status();
			currentVersion.should.equal("20120630174700");
		});
	});
});