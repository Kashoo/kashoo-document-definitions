var businessSyncSpecHelper = require('./modules/business-sync-spec-helper.js');
var testHelper = require('synctos').testHelper;
var errorFormatter = testHelper.validationErrorFormatter;

describe('business-sync payment processor definition document definition', function() {
  beforeEach(function() {
    testHelper.initSyncFunction('build/sync-functions/business-sync/sync-function.js');
  });

  var expectedDocType = 'paymentProcessorDefinition';
  var expectedBasePrivilege = 'CUSTOMER_PAYMENT_PROCESSORS';

  it('successfully creates a valid payment processor document', function() {
    var doc = {
      _id: 'biz.3.paymentProcessor.2',
      provider: 'foo',
      spreedlyGatewayToken: 'bar',
      accountId: 555,
      depositAccountId: 111,
      displayName: 'Foo Bar',
      supportedCurrencyCodes: [ 'CAD', 'USD' ]
    };

    businessSyncSpecHelper.verifyDocumentCreated(expectedBasePrivilege, 3, doc);
  });

  it('cannot create a payment processor document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.1.paymentProcessor.2',
      provider: '',
      spreedlyGatewayToken: '',
      accountId: 0,
      merchantFeesAccountId: 'invalid',
      displayName: 7,
      supportedCurrencyCodes: '',
      'unrecognized-property3': 'foo'
    };

    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      1,
      doc,
      expectedDocType,
      [
        errorFormatter.mustNotBeEmptyViolation('provider'),
        errorFormatter.mustNotBeEmptyViolation('spreedlyGatewayToken'),
        errorFormatter.minimumValueViolation('accountId', 1),
        errorFormatter.typeConstraintViolation('merchantFeesAccountId', 'integer'),
        errorFormatter.typeConstraintViolation('displayName', 'string'),
        errorFormatter.typeConstraintViolation('supportedCurrencyCodes', 'array'),
        errorFormatter.unsupportedProperty('unrecognized-property3')
      ]);
  });

  it('successfully replaces a valid payment processor document', function() {
    var doc = {
      _id: 'biz.5.paymentProcessor.2',
      provider: 'foobar',
      spreedlyGatewayToken: 'barfoo',
      merchantFeesAccountId: 222,
      accountId: 1
    };
    var oldDoc = { _id: 'biz.5.paymentProcessor.2', provider: 'bar' };

    businessSyncSpecHelper.verifyDocumentReplaced(expectedBasePrivilege, 5, doc, oldDoc);
  });

  it('cannot replace a payment processor document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.2.paymentProcessor.2',
      accountId: 555.9,
      displayName: [ ],
      supportedCurrencyCodes: [ '666', 'CAD' ],
      'unrecognized-property4': 'bar'
    };
    var oldDoc = { _id: 'biz.2.paymentProcessor.2', provider: 'foo' };

    businessSyncSpecHelper.verifyDocumentNotReplaced(
      expectedBasePrivilege,
      2,
      doc,
      oldDoc,
      expectedDocType,
      [
        errorFormatter.regexPatternItemViolation('supportedCurrencyCodes[0]', /^[A-Z]{3}$/),
        errorFormatter.typeConstraintViolation('accountId', 'integer'),
        errorFormatter.typeConstraintViolation('displayName', 'string'),
        errorFormatter.requiredValueViolation('provider'),
        errorFormatter.requiredValueViolation('spreedlyGatewayToken'),
        errorFormatter.unsupportedProperty('unrecognized-property4')
      ]);
  });

  it('successfully deletes a payment processor document', function() {
    var oldDoc = { _id: 'biz.8.paymentProcessor.2' };

    businessSyncSpecHelper.verifyDocumentDeleted(expectedBasePrivilege, 8, oldDoc);
  });
});
