var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('app-config-sync payment notification templates document definition', function() {
  var testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/app-config-sync/sync-function.js');

  afterEach(function() {
    testFixture.resetTestEnvironment();
  });

  var expectedChannels = [ 'edit-config' ];

  it('saves an english payment notifications template document', function() {
    var validDoc = {
      _id: 'payment-notifications.en.messages',
      viewInvoiceActionLabel: 'View Invoice',
      editPaymentProcessorConfigActionLabel: 'Edit Processor',
      editLockedPeriodActionLabel: 'Edit Locked Period',
      paymentSuccessSubjectTemplate: 'Payment Subject %s',
      paymentSuccessBodyTemplate: 'Payment Body %s %s',
      badConfigurationSubjectTemplate: 'Bad Config %s',
      missingProcessorBodyTemplate: 'Missing Processor %s',
      processorAuthFailedBodyTemplate: 'Processor Failed',
      lockedPeriodFailureBodyTemplate: 'Locked Period'
    };

    testFixture.verifyDocumentCreated(validDoc, expectedChannels);
  });

  it('refuses a document with invalid content', function() {
    var invalidDoc = {
      _id: 'payment-notifications.en.messages',
      viewInvoiceActionLabel: 23,
      editPaymentProcessorConfigActionLabel: 'Edit Processor',
      editLockedPeriodActionLabel: 'Edit Locked Period',
      paymentSuccessSubjectTemplate: 'Payment Subject %s',
      paymentSuccessBodyTemplate: { invalidProp: 'this aint good' },
      badConfigurationSubjectTemplate: 'Bad Config %s',
      missingProcessorBodyTemplate: 'Missing Processor %s',
      processorAuthFailedBodyTemplate: 'Processor Failed',
      lockedPeriodFailureBodyTemplate: 'Locked Period'
    };

    testFixture.verifyDocumentNotCreated(
      invalidDoc,
      'paymentNotificationTemplates',
      [
        errorFormatter.typeConstraintViolation('viewInvoiceActionLabel', 'string'),
        errorFormatter.typeConstraintViolation('paymentSuccessBodyTemplate', 'string')
      ],
      expectedChannels);
  });
});
