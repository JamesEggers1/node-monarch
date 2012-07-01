"use strict";

var _timestamp = require("../src/utils/timestamp")
	, _mocha = require("mocha")
	, _should = require("should")
	, _up = require("../src/commands/up")
	, _helper = require("./test-helper")
	, _clog = require("clog")
	, _clogConfig = require("../configs/clog-config").none();
	
describe("Up Command", function(){
	describe("Error Cases", function(){
		it("should output an error if the migrations directory does not exist.", function(){
			var errorWasCalled = false;
			_clog.error = function(){ errorWasCalled = true;};
			
			_up();
			errorWasCalled.should.be.true;
		});
		
		it("should output an error if the optional migration was provided but does not exist.", function(){
			var errorWasCalled = false;
			_clog.error = function(){ errorWasCalled = true;};
			
			_helper.createRelativeDirectory("./migrations");
			_up("doesntExist.js");
			errorWasCalled.should.be.true;
			_helper.deleteRelativeDirectory("./migrations");
		});
	});
	
	describe("Migrating Up", function(){
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
		
		it("should migrate to the latest version if currently not at a version.", function(){
			var migrationCounter = 0;
			_clog.test = function(){
				migrationCounter++;
			};
			
			_up();
			migrationCounter.should.equal(3);
		});
		
		it("should migrate to the latest version if newer than current version.", function(){
			var migrationCounter = 0;
			_clog.test = function(){
				migrationCounter++;
			};
			
			_helper.createMigrationTrackerFile(path, "20120630174700.js");
			
			_up();
			migrationCounter.should.equal(2);
		});
		
		it("should migrate to the specified version if provided.", function(){
			var migrationCounter = 0;
			_clog.test = function(){
				migrationCounter++;
			};
			
			_up("20120630174701.js");
			migrationCounter.should.equal(2);
		});
	});
});