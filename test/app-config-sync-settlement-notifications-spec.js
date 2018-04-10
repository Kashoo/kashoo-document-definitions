var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('app-config-sync settlement notification templates document definition', function() {
  var testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/app-config-sync/sync-function.js');

  afterEach(function() {
    testFixture.resetTestEnvironment();
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

    testFixture.verifyDocumentCreated(validDoc, expectedChannels);
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

    testFixture.verifyDocumentNotCreated(
      invalidDoc,
      'settlementNotificationTemplates',
      [
        errorFormatter.mustNotBeEmptyViolation('editPaymentProcessorConfigActionLabel'),
        errorFormatter.typeConstraintViolation('editLockedPeriodActionLabel', 'string')
      ],
      expectedChannels);
  });
});
