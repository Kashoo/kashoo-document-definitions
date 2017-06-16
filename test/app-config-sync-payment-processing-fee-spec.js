var testHelper = require('../node_modules/synctos/etc/test-helper.js');
var errorFormatter = testHelper.validationErrorFormatter;

describe('app-config-sync payment processing fee template document definition', function() {
  beforeEach(function() {
    testHelper.init('build/sync-functions/app-config-sync/sync-function.js');
  });

  var expectedChannels = [ 'edit-config' ];

  it('allows an English-language document', function() {
    var validDoc = {
      _id: 'payment-processing-fee.en.invoice-number',
      lineItemNote: 'my-line-item-note'
    };

    testHelper.verifyDocumentCreated(validDoc, expectedChannels);
  });

  it('refuses a document with invalid content', function() {
    var invalidDoc = {
      _id: 'payment-processing-fee.fr.invoice-id',
      invalid: 'foo'
    };

    testHelper.verifyDocumentNotCreated(
      invalidDoc,
      'paymentProcessingFeeTemplate',
      [
        errorFormatter.requiredValueViolation('lineItemNote'),
        errorFormatter.unsupportedProperty('invalid')
      ],
      expectedChannels);
  });
});
