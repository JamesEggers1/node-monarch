"use strict";
var _helper = require("./integration-helper-postgres")
	, _up = require("../../src/commands/up")
	, mocha = require("mocha")
	, should = require("should")
	, _clog = require("clog");

describe("Migrating Down", function(){
	it("should migrate to the initial version if 0 is passed in.");
	it("should migrate to the specified version if less than current version.");
	it("should not migrate to the specified version if newer than current version.");
});