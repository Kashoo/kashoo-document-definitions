var businessSyncSpecHelperMaker = require('./helpers/business-sync-spec-helper-maker.js');
var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('business-sync payment processor settlement document definition', function() {
  var testFixture, businessSyncSpecHelper;

  beforeEach(function() {
    testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/business-sync/sync-function.js');
    businessSyncSpecHelper = businessSyncSpecHelperMaker.init(testFixture);
  });

  function verifySettlementWritten(businessId, doc, oldDoc) {
    testFixture.verifyDocumentAccepted(doc, oldDoc, businessSyncSpecHelper.staffChannel);
  }

  function verifySettlementNotWritten(businessId, doc, oldDoc, expectedErrorMessages) {
    testFixture.verifyDocumentRejected(doc, oldDoc, 'paymentProcessorSettlement', expectedErrorMessages, businessSyncSpecHelper.staffChannel);
  }

  it('successfully creates a valid payment processor settlement document', function() {
    var doc = {
      _id: 'biz.12345.paymentProcessor.XYZ.processedSettlement.some-settlement-id',
      _attachments: { },
      businessId: 12345,
      transferId: 10,
      settlementId: 'some-settlement-id',
      processorId: 'XYZ',
      capturedAt: '2016-02-29',
      processedAt: '2016-03-03',
      amount: 300,
      currency: 'USD',
      processorMessage: 'my-processor-message'
    };

    verifySettlementWritten(20, doc);
  });

  it('cannot create a payment processor settlement document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.12345.paymentProcessor.XYZ.processedSettlement.foo-bar',
      businessId: 54321,
      settlementId: 'not-foo-bar',
      processorId: 'ZYX',
      capturedAt: 'not-a-capturedAt',
      processedAt: 2123,
      currency: 'USDD',
      processorMessage: 'my-processor-message'
    };

    verifySettlementNotWritten(
      'my-business',
      doc,
      undefined,
      [
        errorFormatter.documentIdRegexPatternViolation(/^biz\.54321\.paymentProcessor\.ZYX\.processedSettlement\.not-foo-bar$/),
        errorFormatter.requiredValueViolation('transferId'),
        errorFormatter.datetimeFormatInvalid('capturedAt'),
        errorFormatter.typeConstraintViolation('processedAt', 'datetime'),
        errorFormatter.requiredValueViolation('amount'),
        errorFormatter.regexPatternItemViolation('currency', /^[A-Z]{3}$/)
      ]);
  });

  it('cannot replace a payment processor settlement document because it is immutable', function() {
    var doc = {
      _id: 'biz.12345.paymentProcessor.XYZ.processedSettlement.foo-bar',
      businessId: 12345,
      transferId: -5,
      settlementId: 'foo-bar',
      processorId: 'XYZ',
      capturedAt: '2016-02-29',
      processedAt: '2016-03-03',
      amount: 300,
      currency: 'USD',
      processorMessage: 'my-other-processor-message',
      whatPropIsThis: 'some value'
    };
    var oldDoc = {
      _id: 'biz.12345.paymentProcessor.XYZ.processedSettlement.foo-bar',
      businessId: 12345,
      transferId: 10,
      settlementId: 'foo-bar',
      processorId: 'XYZ',
      capturedAt: '2016-02-29',
      processedAt: '2016-03-03',
      amount: 300,
      currency: 'USD',
      processorMessage: 'my-processor-message'
    };

    verifySettlementNotWritten(
      12345,
      doc,
      oldDoc,
      [
        errorFormatter.immutableDocViolation(),
        errorFormatter.immutableItemViolation('transferId'),
        errorFormatter.minimumValueViolation('transferId', 1),
        errorFormatter.unsupportedProperty('whatPropIsThis')
      ]);
  });

  it('cannot delete a valid payment processing attempt document because it is immutable', function() {
    var doc = { _id: 'biz.12345.paymentProcessor.XYZ.processedSettlement.foo-bar', _deleted: true };
    var oldDoc = { _id: 'biz.12345.paymentProcessor.XYZ.processedSettlement.foo-bar', businessId: 12345 };

    verifySettlementNotWritten(12345, doc, oldDoc, [ errorFormatter.immutableDocViolation() ]);
  });
});
