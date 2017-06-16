# Introduction

This repository defines the data model for Kashoo's Sync Gateway databases (aka buckets). The configuration is in the form of [synctos](https://github.com/Kashoo/synctos) document definitions. Each subdirectory of the `databases` directory defines the document types for a single database.

**DISCLAIMER**: These document definitions are intended only for use by Kashoo first party client applications. They are published publicly for illustrative purposes only. Expect that the data model may change without notice and, as such, it should not be relied upon for third party client application development.

# Usage

1. Install [Node.js](https://nodejs.org/) to build and run the project
2. Install the project's local dependencies (run from this directory): `npm install`
3. Generate sync functions with synctos (also run from this directory): `etc/make-sync-functions.sh`

# Specifications

Sync function specifications (i.e. unit tests) are defined in the `test/` directory using the [expect.js](https://github.com/Automattic/expect.js) assertion and [simple-mock](https://github.com/jupiter/simple-mock) mocking libraries. Tests are executed by the [Mocha](http://mochajs.org/) test runner. Also, synctos provides a test helper module that reduces the burden of writing new specs. See the synctos [Testing](https://github.com/Kashoo/synctos/blob/master/README.md#testing) documentation for more info.

To execute the test suite (run from this directory): `npm test`
