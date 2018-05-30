var businessSyncSpecHelperMaker = require('./helpers/business-sync-spec-helper-maker.js');
var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('business-sync payment processor business default document definition', function() {
  var testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/business-sync/sync-function.js');
  var businessSyncSpecHelper = businessSyncSpecHelperMaker.init(testFixture);

  afterEach(function() {
    testFixture.resetTestEnvironment();
  });

  var expectedDocType = 'paymentProcessorBusinessDefault';
  var expectedBasePrivilege = 'CUSTOMER_PAYMENT_PROCESSORS';

  it('successfully creates a valid payment processor business default document', function() {
    var doc = {
      _id: 'biz.901.paymentProcessorDefault',
      defaultPaymentProcessorId: 'some-id'
    };

    businessSyncSpecHelper.verifyDocumentCreated(expectedBasePrivilege, 901, doc);
  });

  it('cannot create a payment processor business default document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.901.paymentProcessorDefault',
      defaultPaymentProcessorId: 123
    };

    // basePrivilegeName, businessId, doc, expectedDocType, expectedErrorMessages
    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      901,
      doc,
      expectedDocType,
      [
        'item "defaultPaymentProcessorId" must be a string'
      ]);
  });

  it('successfully replaces a valid payment processor business default document', function() {
    var doc = {
      _id: 'biz.901.paymentProcessorDefault',
      defaultPaymentProcessorId: 'some-proccessor'
    };
    var oldDoc = {
      _id: 'biz.901.paymentProcessorDefault',
      defaultPaymentProcessorId: 'old-proccessor'
    };

    businessSyncSpecHelper.verifyDocumentReplaced(expectedBasePrivilege, 901, doc, oldDoc);
  });

  it('cannot replace a payment processor business default document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.901.paymentProcessorDefault',
      defaultPaymentProcessorId: ''
    };
    var oldDoc = {
      _id: 'biz.901.paymentProcessorDefault',
      defaultPaymentProcessorId: 'old-proccessor'
    };

    businessSyncSpecHelper.verifyDocumentNotReplaced(
      expectedBasePrivilege,
      901,
      doc,
      oldDoc,
      expectedDocType,
      [
        'item "defaultPaymentProcessorId" must not be empty',
      ]);
  });

  it('successfully deletes a payment processor business default document', function() {
    var doc = { _id: 'biz.901.paymentProcessorDefault', _deleted: true };
    var oldDoc = {
      _id: 'biz.901.paymentProcessorDefault',
      defaultPaymentProcessorId: 'old-proccessor'
    };

    businessSyncSpecHelper.verifyDocumentDeleted(expectedBasePrivilege, 901, doc);
  });
});
