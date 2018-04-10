var businessSyncSpecHelperMaker = require('./helpers/business-sync-spec-helper-maker.js');
var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('business-sync payment requisitions reference document definition', function() {
  var testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/business-sync/sync-function.js');
  var businessSyncSpecHelper = businessSyncSpecHelperMaker.init(testFixture);

  afterEach(function() {
    testFixture.resetTestEnvironment();
  });

  var expectedDocType = 'paymentRequisitionsReference';
  var expectedBasePrivilege = 'INVOICE_PAYMENT_REQUISITIONS';

  it('successfully creates a valid payment requisitions reference document', function() {
    var doc = { _id: 'biz.92.invoice.15.paymentRequisitions', paymentProcessorId: 'foo', paymentRequisitionIds: [ 'req1', 'req2' ] };

    businessSyncSpecHelper.verifyDocumentCreated(expectedBasePrivilege, 92, doc);
  });

  it('cannot create a payment requisitions reference document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.18.invoice.7.paymentRequisitions',
      paymentRequisitionIds: [ '' ],
      'unrecognized-property5': 'foo',
      paymentAttemptIds: 79
    };

    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      18,
      doc,
      expectedDocType,
      [
        errorFormatter.requiredValueViolation('paymentProcessorId'),
        errorFormatter.typeConstraintViolation('paymentAttemptIds', 'array'),
        errorFormatter.unsupportedProperty('unrecognized-property5'),
        errorFormatter.mustNotBeEmptyViolation('paymentRequisitionIds[0]')
      ]);
  });

  it('successfully replaces a valid payment requisitions reference document', function() {
    var doc = { _id: 'biz.3612.invoice.222.paymentRequisitions', paymentProcessorId: 'bar' };
    var oldDoc = { _id: 'biz.3612.invoice.222.paymentRequisitions', paymentProcessorId: 'foo', paymentRequisitionIds: [ 'req1' ] };

    businessSyncSpecHelper.verifyDocumentReplaced(expectedBasePrivilege, 3612, doc, oldDoc);
  });

  it('cannot replace a payment requisitions reference document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.666.invoice.3.paymentRequisitions',
      paymentProcessorId: '',
      paymentRequisitionIds: [ 'foo', 15 ],
      'unrecognized-property6': 'bar',
      paymentAttemptIds: [ 73, 'bar' ]
    };
    var oldDoc = { _id: 'biz.666.invoice.3.paymentRequisitions', paymentProcessorId: 'foo', paymentRequisitionIds: [ 'req1' ] };

    businessSyncSpecHelper.verifyDocumentNotReplaced(
      expectedBasePrivilege,
      666,
      doc,
      oldDoc,
      expectedDocType,
      [
        errorFormatter.mustNotBeEmptyViolation('paymentProcessorId'),
        errorFormatter.typeConstraintViolation('paymentRequisitionIds[1]', 'string'),
        errorFormatter.typeConstraintViolation('paymentAttemptIds[0]', 'string'),
        errorFormatter.unsupportedProperty('unrecognized-property6')
      ]);
  });

  it('successfully deletes a payment requisitions reference document', function() {
    var oldDoc = { _id: 'biz.987.invoice.2.paymentRequisitions' };

    businessSyncSpecHelper.verifyDocumentDeleted(expectedBasePrivilege, 987, oldDoc);
  });
});
