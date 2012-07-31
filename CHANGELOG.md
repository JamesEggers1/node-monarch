Change Log
==============

## 2012-07-30 ##
* Added Dev Dependency of `pg` for Postgres integration tests
* Built out Integration-Helper-Postgres.js to be ready for `up` migrations tests.

## 2012-07-11 ##
* Updated to 1.0.8
* Updated CLI to use package.json version.
* Updated Down command to work asynchronously better (added tests to verify).
* Removed excess `console.log()` entries from the status command.
* Renamed HISTORY.md to CHANGELOG.md

## 2012-07-05 ##
* Updated to 1.0.7
* Addressed issue concerning thrown exceptions during synchronous migration scripts.