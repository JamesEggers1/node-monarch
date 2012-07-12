"use strict";
var _helper = require("./integration-helper-postgres")
	, _up = require("../../src/commands/up")
	, mocha = require("mocha")
	, should = require("should")
	, _clog = require("clog");

describe("Migrating Up", function(){
	it("should migrate to the latest version if currently not at a version.");
	it("should migrate to the latest version if newer than current version.");
	it("should migrate to the specified version if provided.");
});