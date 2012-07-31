"use strict";
var _helper = require("./integration-helper-postgres")
	, _up = require("../../src/commands/up")
	, mocha = require("mocha")
	, should = require("should");

describe("Migrating Up", function(){
	it("should migrate to the latest version if currently not at a version."); // Create 2 migrations & verify the 2 tables are created
	it("should migrate to the latest version if newer than current version."); // Create 1 migration & verify the new table is created
	it("should migrate to the specified version if provided."); // Create 2 migrations and & verify the 2 new tables are created.
});