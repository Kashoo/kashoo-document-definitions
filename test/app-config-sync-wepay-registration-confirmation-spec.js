var testHelper = require('../node_modules/synctos/etc/test-helper.js');
var errorFormatter = testHelper.validationErrorFormatter;

describe('app-config-sync WePay registration confirmation template document definition', function() {
  beforeEach(function() {
    testHelper.init('build/sync-functions/app-config-sync/sync-function.js');
  });

  var expectedChannels = [ 'edit-config' ];

  it('allows an English-language document', function() {
    var validDoc = {
      _id: 'wepay-registration-confirmation.en.first-payment',
      subject: 'WePay',
      message: 'Confirm your merchant account now',
      action: 'Go'
    };

    testHelper.verifyDocumentCreated(validDoc, expectedChannels);
  });

  it('refuses a document with invalid content', function() {
    var invalidDoc = {
      _id: 'wepay-registration-confirmation.fr.follow-up',
      subject: false,
      message: 0,
      action: [ ],
      invalid: 'foo'
    };

    testHelper.verifyDocumentNotCreated(
      invalidDoc,
      'wepayRegistrationConfirmationTemplate',
      [
        errorFormatter.typeConstraintViolation('action', 'string'),
        errorFormatter.typeConstraintViolation('message', 'string'),
        errorFormatter.typeConstraintViolation('subject', 'string'),
        errorFormatter.unsupportedProperty('invalid')
      ],
      expectedChannels);
  });
});
