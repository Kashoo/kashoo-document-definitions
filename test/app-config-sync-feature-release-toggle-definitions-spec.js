var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('app-config-sync feature release toggle definitions documents definition', function() {
  var testFixture, businessSyncSpecHelper;

  beforeEach(function() {
    testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/app-config-sync/sync-function.js');
  });

  var expectedChannels = [ 'edit-feature-release-toggle-definitions', 'edit-config' ];

  it('saves feature release toggle definitions', function() {
    var doc = {
      _id: 'featureReleaseToggleDefinitions',
      toggles: [ {
          name: 'foo-toggle',
          description: 'desc',
          ticketId: 'kbw-2342',
          state: 'development only',
          note: 'foo'
        }, {
          name: 'bar-toggle',
          description: 'desc',
          ticketId: 'kbw-141',
          state: 'development only',
        }
      ]
    };

    testFixture.verifyDocumentCreated(doc, expectedChannels);
  });

  it('refuses a document with invalid content', function() {
    var invalidDoc = {
      _id: 'featureReleaseToggleDefinitions',
      toggles: [ {
          foo: 'bar'
        }
      ]
    };

    testFixture.verifyDocumentNotCreated(
      invalidDoc,
      'featureReleaseToggleDefinitions',
      [
        errorFormatter.requiredValueViolation('toggles[0].name'),
        errorFormatter.requiredValueViolation('toggles[0].description'),
        errorFormatter.requiredValueViolation('toggles[0].state'),
        errorFormatter.unsupportedProperty('toggles[0].foo')
      ],
      expectedChannels);
  });
});
