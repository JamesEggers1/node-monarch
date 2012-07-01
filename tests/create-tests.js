"use strict";

var _timestamp = require("../src/utils/timestamp")
	, _mocha = require("mocha")
	, _should = require("should")
	, _create = require("../src/commands/create")
	, _helper = require("./test-helper")
	, _clogConfig = require("../configs/clog-config").none();
	
describe("Create Command", function(){
	var migrationsDirectory = "./migrations"
		, timestamp = "20120101235959";
	
	before(function(done){
		if (_helper.relativeDirectoryExists(migrationsDirectory)){
			_helper.deleteRelativeDirectory(migrationsDirectory);
		}
		
		_timestamp.generateTimeStamp = function(){
			return timestamp;
		};
		
		done();
	});
	
	after(function(done){
		if (_helper.relativeDirectoryExists(migrationsDirectory)){
			_helper.deleteRelativeDirectory(migrationsDirectory);
		}
	
		done();
	});
	
	it("should create the migrations directory if the directory is missing.", function(){
		_create("test");
		_helper.relativeDirectoryExists(migrationsDirectory).should.be.true;
	});
	
	it ("should create a new migrations file in the migrations directory with the proper timestamped name", function(){
		var expectedFileName = timestamp + "_test.js";
		_create("test");
		
		_helper.relativeDirectoryExists(migrationsDirectory).should.be.true;
		_helper.relativeFileExists(migrationsDirectory + "/" + expectedFileName).should.be.true;
		
	});
});