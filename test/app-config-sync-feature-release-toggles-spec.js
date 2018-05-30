var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('app-config-sync feature release toggle document definition', function() {
  var testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/app-config-sync/sync-function.js');

  afterEach(function() {
    testFixture.resetTestEnvironment();
  });

  var expectedChannels = [ 'edit-feature-release-toggles', 'edit-config' ];

  it('saves the feature release toggle document', function() {
    var doc = { _id: 'featureReleaseToggles', enabledFeatures: [ 'foo' ] };

    testFixture.verifyDocumentCreated(doc, expectedChannels);
  });

  it('refuses a document with invalid content', function() {
    var doc = { _id: 'featureReleaseToggles', enabledFeatures: [ '~' ] };

    testFixture.verifyDocumentNotCreated(
      doc,
      'featureReleaseToggles',
      errorFormatter.regexPatternItemViolation('enabledFeatures[0]', /^[a-z0-9_-]+$/),
      expectedChannels);
  });
});
