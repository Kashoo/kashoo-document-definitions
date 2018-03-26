var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('app-config-sync payment processing fee template document definition', function() {
  var testFixture, businessSyncSpecHelper;

  beforeEach(function() {
    testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/app-config-sync/sync-function.js');
  });

  var expectedChannels = [ 'edit-config' ];

  it('allows an English-language document', function() {
    var validDoc = {
      _id: 'payment-processing-fee.en.invoice-number',
      lineItemNote: 'my-line-item-note'
    };

    testFixture.verifyDocumentCreated(validDoc, expectedChannels);
  });

  it('refuses a document with invalid content', function() {
    var invalidDoc = {
      _id: 'payment-processing-fee.fr.invoice-id',
      invalid: 'foo'
    };

    testFixture.verifyDocumentNotCreated(
      invalidDoc,
      'paymentProcessingFeeTemplate',
      [
        errorFormatter.requiredValueViolation('lineItemNote'),
        errorFormatter.unsupportedProperty('invalid')
      ],
      expectedChannels);
  });
});
