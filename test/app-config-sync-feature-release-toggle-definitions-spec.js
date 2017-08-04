var testHelper = require('../node_modules/synctos/etc/test-helper.js');
var errorFormatter = testHelper.validationErrorFormatter;

describe('app-config-sync feature release toggle definitions documents definition', function() {
  beforeEach(function() {
    testHelper.init('build/sync-functions/app-config-sync/sync-function.js');
  });

  var expectedChannels = [ 'edit-feature-release-toggle-definitions', 'edit-config' ];

  it('saves feature release toggle definitions', function() {
    var doc = {
      _id: 'feature-release-toggle.foo-toggle',
      name: 'foo-toggle',
      description: 'desc',
      ticketId: 'kbw-2342',
      state: 'development',
      note: 'foo'
    };

    testHelper.verifyDocumentCreated(doc, expectedChannels);
  });

  it('refuses a document with invalid content', function() {
    var invalidDoc = {
      _id: 'feature-release-toggle.foo-toggle',
      name: '',
      state: 'foo'
    };

    testHelper.verifyDocumentNotCreated(
      invalidDoc,
      'featureReleaseToggleDefinitions',
      [
        errorFormatter.mustNotBeEmptyViolation('name'),
        errorFormatter.regexPatternItemViolation('name', /^[a-z0-9_-]+$/),
        errorFormatter.requiredValueViolation('description'),
        errorFormatter.enumPredefinedValueViolation('state', [ 'development', 'ready', 'remove' ])
      ],
      expectedChannels);
  });

  it('cannot replace name property', function() {
    var doc = {
      _id: 'feature-release-toggle.foo-toggle',
      name: 'foo-toggle-2',
      description: 'desc',
      state: 'development'
    };
    var oldDoc = {
      _id: 'feature-release-toggle.foo-toggle',
      name: 'foo-toggle',
      description: 'desc',
      state: 'development'
    };

    testHelper.verifyDocumentRejected(
      doc,
      oldDoc,
      'featureReleaseToggleDefinitions',
      [
        errorFormatter.immutableItemViolation('name')
      ],
      expectedChannels);
  });
});
