<img src="https://github.com/JamesEggers1/node-monarch/raw/master/images/Monarch_butterfly_USGS.png" height="118px" width="128px">

Monarch [![Build Status](https://secure.travis-ci.org/JamesEggers1/node-monarch.png)](http://travis-ci.org/JamesEggers1/node-monarch)
=============

Monarch is a command line utility for Node.js that provides a platform for performing generic migrations.  If you are looking for a way to track the versions or changes of your database, Monarch can help you with such.

## Installation ##

    npm install -g monarch

## Testing ##

Monarch has unit tests built around it than can be used to verify the package before usage.  The tests are written with the Mocha and Should modules and running the below command will run all of the tests.  

    npm test monarch

## Usage ##

Monarch is a command line utility.  Once the package is installed via NPM, you can begin using it as normal.  To get a list of commands and options for the utility, simply using the `--help` flag will provide the following information.

    Usage: monarch [options] [command]

    Commands:

      create <description>
      Creates a new migration script
  
      up [migration]
      Runs the migration scripts up to the latest or specified version.
  
      down <migration>
      Runs the migration scripts down to the specified version.
  
      status 
      Retrieves the current version of the migrations.

    Options:

      -h, --help     output usage information
      -V, --version  output the version number
      -d, --debug    Runs the application in debugging mode.

## The `Create` Command ##

The `create` command is used to generate new migration scripts.  Each migration script is named by the description you provide and a timestamp in YYYYMMDDHHMMSS format.  Timestamps are used in order to help ease codebase merging issues that come from sequentially numbered files.

    monarch create "initial schema"
	-> 20120630235959_initial_schema.js has been created.

By default, all migrations will be placed into a `migrations` directory located in the current working directory.

An example of the created migration script is as follows:

    exports.name = "20120630235959_initial_schema.js";
    
    exports.up = function(logger){
    
    };
    
    exports.down = function(logger){
    
    };

At this point, you can open up the generated file created by `monarch` and begin to code your migration.  When ran, `monarch` will pass in a reference to its logging system in order to encourage a more unified logging system.

## The `Up` Command ##

The `up` command runs the migration scripts from the current version to the most recent version.  You can specify the file to migrate to as an optional parameter.

    monarch up
    -> Migrates up through all files that are newer than the current version.

    monarch up 20120803235959_added_customer_table.js
    -> Will migrate up to the specified file but not beyond if newer migrations exist.

When the `up` command is issued, `monarch` will import in all migration scripts and sort them in ascending order before looping through them and running their `up` functions.

## The `Down` Command ##

The `down` command is the opposite of the `up` command, in that it will run the migration scripts' `down` function in the descending order of the files.  Unlike the `up` command, `down` requires the file to be passed to it so it knows where to stop.

    monarch down 20120630235959_initial_schema.js
    -> Runs all migration scripts' 'down' function until it find the specified file and then stops.

    monarch down 0
    -> Runs all migration scripts' 'down' function as if no migrations were ever done.

## The `Status` Command ##

The `status` command simply reports back the current version of the migration system. 

   monarch status
   -> Current Version: 20120630235959_initial_schema.js

The status of migration system is tied to a `.migrationTracker` file located in the same `migrations` directory as the migration scripts.

## License ##

Copyright (c) 2012 James Eggers

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.