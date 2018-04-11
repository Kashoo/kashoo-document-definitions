var businessSyncSpecHelperMaker = require('./helpers/business-sync-spec-helper-maker.js');
var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('business-sync payment processing attempt document definition', function() {
  var testFixture, businessSyncSpecHelper;

  beforeEach(function() {
    testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/business-sync/sync-function.js');
    businessSyncSpecHelper = businessSyncSpecHelperMaker.init(testFixture);
  });

  function verifyPaymentAttemptWritten(businessId, doc, oldDoc) {
    testFixture.verifyDocumentAccepted(doc, oldDoc, businessSyncSpecHelper.staffChannel);
  }

  function verifyPaymentAttemptNotWritten(businessId, doc, oldDoc, expectedErrorMessages) {
    testFixture.verifyDocumentRejected(doc, oldDoc, 'paymentAttempt', expectedErrorMessages, businessSyncSpecHelper.staffChannel);
  }

  it('successfully creates a valid payment processing attempt document', function() {
    var doc = {
      _id: 'paymentAttempt.foo-bar',
      _attachments: { },
      businessId: 20,
      invoiceRecordId: 10,
      paymentRequisitionId: 'my-payment-requisition',
      paymentAttemptSpreedlyToken: 'my-spreedly-token',
      date: '2016-02-29',
      internalPaymentRecordId: 30,
      paymentProcessorId: 'my-payment-processor-id',
      gatewayTransactionId: 'my-gateway-transaction',
      gatewayMessage: 'my-gateway-message',
      totalAmountPaid: 72838,
      totalAmountPaidFormatted: '$728.38',
      payerEmail: 'foo@bar.baz',
      gatewaySpecificFields: {
        'somekey': {
          'field1': 'value1'
        }
      }
    };

    verifyPaymentAttemptWritten(20, doc);
  });

  it('cannot create a payment processing attempt document when the properties are invalid', function() {
    var doc = {
      _id: 'paymentAttempt.foo-bar',
      businessId: 'my-business',
      paymentRequisitionId: '',
      paymentAttemptSpreedlyToken: '',
      date: '2016-00-30', // The month is invalid
      internalPaymentRecordId: 0,
      paymentProcessorId: 2,
      gatewayTransactionId: '',
      gatewayMessage: 17,
      totalAmountPaid: 'invalid',
      totalAmountPaidFormatted: 999,
      payerEmail: 4,
      unsupportedProperty: 'foobar'
    };

    verifyPaymentAttemptNotWritten(
      'my-business',
      doc,
      undefined,
      [
        errorFormatter.typeConstraintViolation('businessId', 'integer'),
        errorFormatter.requiredValueViolation('invoiceRecordId'),
        errorFormatter.mustNotBeEmptyViolation('paymentRequisitionId'),
        errorFormatter.mustNotBeEmptyViolation('paymentAttemptSpreedlyToken'),
        errorFormatter.datetimeFormatInvalid('date'),
        errorFormatter.minimumValueViolation('internalPaymentRecordId', 1),
        errorFormatter.typeConstraintViolation('paymentProcessorId', 'string'),
        errorFormatter.mustNotBeEmptyViolation('gatewayTransactionId'),
        errorFormatter.typeConstraintViolation('gatewayMessage', 'string'),
        errorFormatter.typeConstraintViolation('totalAmountPaid', 'integer'),
        errorFormatter.typeConstraintViolation('totalAmountPaidFormatted', 'string'),
        errorFormatter.typeConstraintViolation('payerEmail', 'string'),
        errorFormatter.unsupportedProperty('unsupportedProperty')
      ]);
  });

  it('cannot replace a payment processing attempt document because it is immutable', function() {
    var doc = {
      _id: 'paymentAttempt.foo-bar',
      businessId: 0,
      invoiceRecordId: 0,
      gatewayTransactionId: 7,
      gatewayMessage: true,
      totalAmountPaid: 0,
      totalAmountPaidFormatted: '',
      unsupportedProperty: 'foobar'
    };
    var oldDoc = {
      _id: 'paymentAttempt.foo-bar',
      businessId: 23,
      invoiceRecordId: 79,
      paymentRequisitionId: 'my-payment-req',
      paymentAttemptSpreedlyToken: 'my-spreedly-token',
      date: '2016-06-29'
    };

    verifyPaymentAttemptNotWritten(
      23,
      doc,
      oldDoc,
      [
        errorFormatter.immutableDocViolation(),
        errorFormatter.minimumValueViolation('businessId', 1),
        errorFormatter.minimumValueViolation('invoiceRecordId', 1),
        errorFormatter.requiredValueViolation('paymentRequisitionId'),
        errorFormatter.requiredValueViolation('paymentAttemptSpreedlyToken'),
        errorFormatter.requiredValueViolation('date'),
        errorFormatter.typeConstraintViolation('gatewayTransactionId', 'string'),
        errorFormatter.typeConstraintViolation('gatewayMessage', 'string'),
        errorFormatter.minimumValueViolation('totalAmountPaid', 1),
        errorFormatter.mustNotBeEmptyViolation('totalAmountPaidFormatted'),
        errorFormatter.unsupportedProperty('unsupportedProperty')
      ]);
  });

  it('cannot delete a valid payment processing attempt document because it is immutable', function() {
    var doc = { _id: 'paymentAttempt.foo-bar', _deleted: true };
    var oldDoc = { _id: 'paymentAttempt.foo-bar', businessId: 20 };

    verifyPaymentAttemptNotWritten(20, doc, oldDoc, [ errorFormatter.immutableDocViolation() ]);
  });
});
