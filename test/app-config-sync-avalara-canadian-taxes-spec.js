var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('app-config-sync Avalara Canadian taxes document definition', function() {
  var testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/app-config-sync/sync-function.js');

  afterEach(function() {
    testFixture.resetTestEnvironment();
  });

  var expectedChannels = [ 'edit-config' ];

  it('saves an Avalara Canadian taxes document', function() {
    var validDoc = {
      _id: 'avalara-canadian-taxes',
      whateverField: 'it might send'
    };

    testFixture.verifyDocumentCreated(validDoc, expectedChannels);
  });
});
