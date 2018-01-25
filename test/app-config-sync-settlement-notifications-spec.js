var testHelper = require('synctos').testHelper;
var errorFormatter = testHelper.validationErrorFormatter;

describe('app-config-sync settlement notification templates document definition', function() {
  beforeEach(function() {
    testHelper.initSyncFunction('build/sync-functions/app-config-sync/sync-function.js');
  });

  var expectedChannels = [ 'edit-config' ];

  it('saves an english settlement notifications template document', function() {
    var validDoc = {
      _id: 'settlement-notifications.en.messages',
      editPaymentProcessorConfigActionLabel: 'Edit Processor',
      editLockedPeriodActionLabel: 'Edit Locked Period',
      settlementProcessingFailedSubject: 'Your Settlement Failed!',
      settlementProcessingFailedBody: 'Check this out.  Settlement ${settlementId} failed because:',
      removedAccountTemplate: "Payment account ${accountId} was removed",
      lockedPeriodFailureBodyTemplate: 'Locked Period'
    };

    testHelper.verifyDocumentCreated(validDoc, expectedChannels);
  });

  it('refuses a document with invalid content', function() {
    var invalidDoc = {
      _id: 'settlement-notifications.en.messages',
      editPaymentProcessorConfigActionLabel: '',
      editLockedPeriodActionLabel: 54,
      settlementProcessingFailedSubject: 'Your Settlement Failed!',
      settlementProcessingFailedBody: 'Check this out.  Settlement ${settlementId} failed because:',
      removedAccountTemplate: "Payment account ${accountId} was removed",
    };

    testHelper.verifyDocumentNotCreated(
      invalidDoc,
      'settlementNotificationTemplates',
      [
        errorFormatter.mustNotBeEmptyViolation('editPaymentProcessorConfigActionLabel'),
        errorFormatter.typeConstraintViolation('editLockedPeriodActionLabel', 'string')
      ],
      expectedChannels);
  });
});
