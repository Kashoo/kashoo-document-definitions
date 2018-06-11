var businessSyncSpecHelperMaker = require('./helpers/business-sync-spec-helper-maker.js');
var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('business-sync payment processor customer default document definition', function() {
  var testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/business-sync/sync-function.js');
  var businessSyncSpecHelper = businessSyncSpecHelperMaker.init(testFixture);

  afterEach(function() {
    testFixture.resetTestEnvironment();
  });

  var expectedDocType = 'paymentProcessorCustomerDefault';
  var expectedBasePrivilege = 'CONTACTS';

  it('successfully creates a valid payment processor customer default document', function() {
    var doc = {
      _id: 'biz.901.customer.293498985.defaultPaymentProcessor',
      defaultPaymentProcessor: 'processor-1'
    };

    businessSyncSpecHelper.verifyDocumentCreated(expectedBasePrivilege, 901, doc);
  });

  it('cannot create a payment processor customer default document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.901.customer.293498985.defaultPaymentProcessor',
      defaultPaymentProcessor: ''
    };

    // basePrivilegeName, businessId, doc, expectedDocType, expectedErrorMessages
    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      901,
      doc,
      expectedDocType,
      [
        'item "defaultPaymentProcessor" must not be empty'
      ]);
  });

  it('successfully replaces a valid payment processor customer default document', function() {
    var doc = {
      _id: 'biz.901.customer.293498985.defaultPaymentProcessor',
      defaultPaymentProcessor: 'new-processor-2'
    };
    var oldDoc = {
      _id: 'biz.901.customer.293498985.defaultPaymentProcessor',
      defaultPaymentProcessor: 'processor-1'
    };

    businessSyncSpecHelper.verifyDocumentReplaced(expectedBasePrivilege, 901, doc, oldDoc);
  });

  it('cannot replace a payment processor customer default document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.901.customer.293498985.defaultPaymentProcessor',
    };
    var oldDoc = {
      _id: 'biz.901.customer.293498985.defaultPaymentProcessor',
      defaultPaymentProcessor: 'processor-1'
    };

    businessSyncSpecHelper.verifyDocumentNotReplaced(
      expectedBasePrivilege,
      901,
      doc,
      oldDoc,
      expectedDocType,
      [ errorFormatter.requiredValueViolation('defaultPaymentProcessor') ]);
  });

  it('successfully deletes a payment processor customer default summary document', function() {
    var doc = { _id: 'biz.901.customer.293498985.defaultPaymentProcessor', _deleted: true };
    var oldDoc = {
      _id: 'biz.901.customer.293498985.defaultPaymentProcessor',
      defaultPaymentProcessor: 'processor-1'
    };

    businessSyncSpecHelper.verifyDocumentDeleted(expectedBasePrivilege, 901, doc);
  });
});
