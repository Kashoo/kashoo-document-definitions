var testHelper = require('synctos').testHelper;
var errorFormatter = testHelper.validationErrorFormatter;

describe('app-config-sync feature release toggle document definition', function() {
  beforeEach(function() {
    testHelper.initSyncFunction('build/sync-functions/app-config-sync/sync-function.js');
  });

  var expectedChannels = [ 'edit-feature-release-toggles', 'edit-config' ];

  it('saves the feature release toggle document', function() {
    var doc = { _id: 'featureReleaseToggles', enabledFeatures: [ 'foo' ] };

    testHelper.verifyDocumentCreated(doc, expectedChannels);
  });

  it('refuses a document with invalid content', function() {
    var doc = { _id: 'featureReleaseToggles', enabledFeatures: 72 };

    testHelper.verifyDocumentNotCreated(
      doc,
      'featureReleaseToggles',
      errorFormatter.typeConstraintViolation('enabledFeatures', 'array'),
      expectedChannels);
  });
});
