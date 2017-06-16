var businessSyncSpecHelper = require('./modules/business-sync-spec-helper.js');
var testHelper = require('../node_modules/synctos/etc/test-helper.js');
var errorFormatter = testHelper.validationErrorFormatter;

describe('business-sync payment requisition document definition', function() {
  beforeEach(function() {
    testHelper.init('build/sync-functions/business-sync/sync-function.js');
  });

  var expectedDocType = 'paymentRequisition';
  var expectedBasePrivilege = 'INVOICE_PAYMENT_REQUISITIONS';

  it('successfully creates a valid payment requisition document', function() {
    var doc = {
      _id: 'paymentRequisition.foo-bar',
      invoiceRecordId: 10,
      businessId: 20,
      issuedAt: '2016-02-29T17:13:43.666Z',
      issuedByUserId: 42,
      invoiceRecipients: 'foo@bar.baz'
    };

    businessSyncSpecHelper.verifyDocumentCreated(expectedBasePrivilege, 20, doc);
  });

  it('cannot create a payment requisition document when the properties are invalid', function() {
    var doc = {
      _id: 'paymentRequisition.foo-bar',
      invoiceRecordId: 0,
      businessId: '6',
      issuedAt: '2016-13-29T17:13:43.666Z', // The month is invalid
      issuedByUserId: 0,
      invoiceRecipients: [ 'foo@bar.baz' ],
      'unrecognized-property7': 'foo'
    };

    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      6,
      doc,
      expectedDocType,
      [
        errorFormatter.typeConstraintViolation('businessId', 'integer'),
        errorFormatter.minimumValueViolation('invoiceRecordId', 1),
        errorFormatter.datetimeFormatInvalid('issuedAt'),
        errorFormatter.minimumValueViolation('issuedByUserId', 1),
        errorFormatter.typeConstraintViolation('invoiceRecipients', 'string'),
        errorFormatter.unsupportedProperty('unrecognized-property7')
      ]);
  });

  it('cannot replace a payment requisition document because it is marked as irreplaceable', function() {
    var doc = {
      _id: 'paymentRequisition.foo-bar',
      invoiceRecordId: '7',
      businessId: 0,
      issuedAt: '2016-02-29T25:13:43.666Z', // The hour is invalid
      issuedByUserId: '42',
      invoiceRecipients: 15,
      'unrecognized-property8': 'bar'
    };
    var oldDoc = { _id: 'paymentRequisition.foo-bar', invoiceRecordId: 10, businessId: 20 };

    businessSyncSpecHelper.verifyDocumentNotReplaced(
      expectedBasePrivilege,
      20,
      doc,
      oldDoc,
      expectedDocType,
      [
        errorFormatter.minimumValueViolation('businessId', 1),
        errorFormatter.typeConstraintViolation('invoiceRecordId', 'integer'),
        errorFormatter.datetimeFormatInvalid('issuedAt'),
        errorFormatter.typeConstraintViolation('issuedByUserId', 'integer'),
        errorFormatter.typeConstraintViolation('invoiceRecipients', 'string'),
        errorFormatter.unsupportedProperty('unrecognized-property8'),
        errorFormatter.cannotReplaceDocViolation()
      ]);
  });

  it('successfully deletes a payment requisition document', function() {
    var oldDoc = { _id: 'paymentRequisition.foo-bar', invoiceRecordId: 10, businessId: 17 };

    businessSyncSpecHelper.verifyDocumentDeleted(expectedBasePrivilege, 17, oldDoc);
  });
});
