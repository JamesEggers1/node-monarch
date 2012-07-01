"use strict";

var _timestamp = require("../src/utils/timestamp")
	, _mocha = require("mocha")
	, _should = require("should")
	, _down = require("../src/commands/down")
	, _helper = require("./test-helper")
	, _clog = require("clog")
	, _clogConfig = require("../configs/clog-config").none();
	
describe("Up Command", function(){
	describe("Error Cases", function(){
		it("should output an error if the migrations directory does not exist.", function(){
			var errorWasCalled = false;
			_clog.error = function(){ errorWasCalled = true;};
			
			_down();
			errorWasCalled.should.be.true;
		});
		
		it("should output an error if the required migration was not provided.", function(){
			var errorWasCalled = false;
			_clog.error = function(){ errorWasCalled = true;};
			
			_helper.createRelativeDirectory("./migrations");
			_down();
			errorWasCalled.should.be.true;
			_helper.deleteRelativeDirectory("./migrations");
		});
		
		it("should output an error if the required migration was provided but does not exist.", function(){
			var errorWasCalled = false;
			_clog.error = function(){ errorWasCalled = true;};
			
			_helper.createRelativeDirectory("./migrations");
			_down("doesntExist.js");
			errorWasCalled.should.be.true;
			_helper.deleteRelativeDirectory("./migrations");
		});
	});
	
	describe("Migrating Down", function(){
		var count = 3
			, path = "./migrations";
			
		beforeEach(function(done){
			_helper.downMigrationSetup(path, count);
			_helper.createMigrationTrackerFile(path, "20120630174702.js");
			done();
		});
	
		afterEach(function(done){
			_helper.deleteRelativeDirectory(path);
			done();
		});
		
		it("should migrate to the initial version if 0 is passed in.", function(){
			var migrationCounter = 0;
			_clog.test = function(){
				migrationCounter++;
			};
			
			_down("0");
			migrationCounter.should.equal(3);
		});
		
		it("should migrate to the specified version if less than current version.", function(){
			var migrationCounter = 0;
			_clog.test = function(){
				migrationCounter++;
			};
			
			_down("20120630174700.js");
			migrationCounter.should.equal(2);
		});
		
		it("should not migrate to the specified version if newer than current version.", function(){
			var migrationCounter = 0;
			_clog.test = function(){
				migrationCounter++;
			};
			
			_down("20120630174703.js");
			migrationCounter.should.equal(0);
		});
	});
});