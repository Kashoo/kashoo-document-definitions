# Getting Started

1. Install [Node.js](https://nodejs.org/) to build and run the project
2. Install the project's local dependencies, including [synctos](https://github.com/Kashoo/synctos) (run from this directory): `npm install`
3. Generate sync functions with synctos (also run from this directory): `etc/make-sync-functions.sh`

# Making Changes

This section contains information on how to implement changes.

### Databases

Each subdirectory of the `databases` directory corresponds to a single Sync Gateway database (aka bucket).

When adding a new database, ensure that the directory name **exactly** matches the new database's name as it will be configured in Sync Gateway. By convention, the document definitions _must_ be defined in a file called `doc-definitions.js` within the corresponding database directory.

Add an overview of new databases to the **Databases** section of the README.

### Document definitions

To promote modularity, you are strongly encouraged to define each individual document definition in its own [document definition fragment](https://github.com/Kashoo/synctos/blob/master/README.md#modularity) within the corresponding database directory.

Be sure to limit the channels, roles and users that have access to a document type to the bare minimum that is required. Follow the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege).

Also endeavour to apply strict constraints to the properties of document definitions to limit the potential for invalid data to pollute the system. If it does not make sense, for example, for a number to be negative, ensure that the property validator specifies a minimum value of zero. Likewise, if a string property should adhere to a specific format, consider applying a regular expression pattern to the property validator. And, if the document type supports file attachments, be absolutely certain to set limits on the number and size that are allowed via the document-level attachment constraints.

### Testing

Every change should include comprehensive test cases defined in the `test` directory using the [expect.js](https://github.com/Automattic/expect.js) assertion and [simple-mock](https://github.com/jupiter/simple-mock) mocking libraries. Tests are executed by the [Mocha](http://mochajs.org/) test runner. Make use of the built-in synctos test-helper module to simplify test cases. See the synctos [Testing](https://github.com/Kashoo/synctos/blob/master/README.md#testing) documentation for more info.

To execute the test suite (run from this directory): `npm test`

### Backward compatibility

Every reasonable effort should be made to preserve backward compatibility with existing Kashoo first party client applications when making changes to document definitions. For instance, it is inadvisable to add required properties to or remove old properties from a document type after that document type has already been in use in production.

### Pull requests

Each change must be implemented in its own feature branch and submitted via a GitHub pull request for code review. Be sure to include an entry for each change in `CHANGELOG.md`'s "Unreleased" section according to the guidelines at [Keep a CHANGELOG](http://keepachangelog.com).

# Reviewing Changes

Once a change has been posted as a GitHub pull request, a Kashoo developer other than the change's author needs to examine the code/configuration for style, correctness, test coverage, documentation and semantics. Special care should be taken to ensure that document definitions are always limited to the minimum set of channels, roles and users (collectively, "permissions") that are necessary to fulfill their function and that the set of permissions is appropriate for the various read and write operations. Also be sure that document property validators are appropriately strict in the constraints they apply.

If/when a change is deemed satisfactory, it is the responsibility of the reviewer to merge the pull request and delete its feature branch, where possible.
