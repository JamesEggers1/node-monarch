"use strict";

var create = require("./unit/test-create")
	, status = require("./unit/test-status")
	, down = require("./unit/test-down")
	, up = require("./unit/test-up");
	
if (process.env.INTEGRATION_TESTS){
	var postgres = require("./integration/test--postgres");
}