var businessSyncSpecHelper = require('./modules/business-sync-spec-helper.js');
var testHelper = require('../node_modules/synctos/etc/test-helper.js');
var errorFormatter = testHelper.validationErrorFormatter;

describe('business-sync shoebox item document definition', function() {
  beforeEach(function() {
    testHelper.init('build/sync-functions/business-sync/sync-function.js');
  });

  var expectedDocType = 'shoeboxItem';
  var expectedBasePrivilege = 'SHOEBOX_ITEMS';

  it('successfully creates a valid shoebox item document', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank-record',
      source: 'yodlee',
      sourceId: '1239004',
      received: '2016-06-18T18:57:35.328-08:00',
      data: '{ "bank-rec": "data" }',
      unknownProp: 'some-value'
    };

    businessSyncSpecHelper.verifyDocumentCreated(expectedBasePrivilege, 3, doc);
  });

  it('cannot create a shoebox item document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.1.shoeboxItem.bank-record.XYZ',
      type: 4,
      source: '',
      sourceId: 982784,
      received: 'some non-date',
      data: 2.4,
    };

    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      1,
      doc,
      expectedDocType,
      [
        errorFormatter.typeConstraintViolation('type', 'string'),
        errorFormatter.mustNotBeEmptyViolation('source'),
        errorFormatter.typeConstraintViolation('sourceId', 'string'),
        errorFormatter.datetimeFormatInvalid('received'),
        errorFormatter.typeConstraintViolation('data', 'string'),
      ]);
  });

  it('cannot replace a valid shoebox item document', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank-record',
      source: 'yodlee',
      received: '2016-06-18T18:57:35.328-08:00',
      data: '{ "bank-rec": "changed data" }',
      unknownProp: 'some-value'
    };
    var oldDoc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank-record',
      source: 'yodlee',
      received: '2016-06-18T18:57:35.328-08:00',
      data: '{ "bank-rec": "data" }',
      unknownProp: 'some-value'
    };

    businessSyncSpecHelper.verifyDocumentNotReplaced(expectedBasePrivilege, 3, doc, oldDoc, expectedDocType, [ errorFormatter.immutableDocViolation() ]);
  });

  it('cannot delete a shoebox item document', function() {
    var oldDoc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank-record',
      source: 'yodlee',
      received: '2016-06-18T18:57:35.328-08:00',
      data: '{ "bank-rec": "data" }',
      unknownProp: 'some-value'
    };

    businessSyncSpecHelper.verifyDocumentNotDeleted(expectedBasePrivilege, 3, oldDoc, expectedDocType, [ errorFormatter.immutableDocViolation() ]);
  });
});
