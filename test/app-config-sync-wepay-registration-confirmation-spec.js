var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('app-config-sync WePay registration confirmation template document definition', function() {
  var testFixture, businessSyncSpecHelper;

  beforeEach(function() {
    testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/app-config-sync/sync-function.js');
  });

  var expectedChannels = [ 'edit-config' ];

  it('allows an English-language document', function() {
    var validDoc = {
      _id: 'wepay-registration-confirmation.en.first-payment',
      subject: 'WePay',
      message: 'Confirm your merchant account now',
      action: 'Go'
    };

    testFixture.verifyDocumentCreated(validDoc, expectedChannels);
  });

  it('refuses a document with invalid content', function() {
    var invalidDoc = {
      _id: 'wepay-registration-confirmation.fr.follow-up',
      subject: false,
      message: 0,
      action: [ ],
      invalid: 'foo'
    };

    testFixture.verifyDocumentNotCreated(
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
