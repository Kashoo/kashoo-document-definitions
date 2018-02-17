var businessSyncSpecHelper = require('./modules/business-sync-spec-helper.js');
var testHelper = require('synctos').testHelper;
var errorFormatter = testHelper.validationErrorFormatter;

describe('business-sync shoebox item document definition', function() {
  beforeEach(function() {
    testHelper.initSyncFunction('build/sync-functions/business-sync/sync-function.js');
  });

  var expectedDocType = 'shoeboxItem';
  var expectedBasePrivilege = 'SHOEBOX_ITEMS';

  it('successfully creates a valid shoebox item document', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      sourceId: '1239004',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      },
      previousData: [
        {
          received: '2016-06-18T18:57:35.328-08:00',
          data: {
            foo: 'bar'
          }
        },
        {
          received: '2016-06-18T18:57:35.328-08:00',
          data: {
            foo: 'bar'
          }
        }
      ],
      unknownProp: 'some-value'
    };

    businessSyncSpecHelper.verifyDocumentCreated(expectedBasePrivilege, 3, doc);
  });

  it('successfully creates a shoebox item document with a missing previous data field', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      sourceId: '1239004',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      },
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
      data: 2.4
    };

    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      1,
      doc,
      expectedDocType,
      [
        errorFormatter.enumPredefinedValueViolation('type', [ 'bank', 'document', 'email' ]),
        errorFormatter.mustNotBeEmptyViolation('source'),
        errorFormatter.typeConstraintViolation('sourceId', 'string'),
        errorFormatter.datetimeFormatInvalid('received'),
        errorFormatter.typeConstraintViolation('data', 'object')
      ]);
  });

  it('cannot create a shoebox item document with an invalid type', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'foo',
      source: 'yodlee',
      sourceId: '1239004',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      }
    };

    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      3,
      doc,
      expectedDocType,
      [
        errorFormatter.enumPredefinedValueViolation('type', [ 'bank', 'document', 'email' ])
      ]);
  });

  it('can successfully replace a valid shoebox item document', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      },
      unknownProp: 'some-value'
    };
    var oldDoc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'baz'
      },
    };

    businessSyncSpecHelper.verifyDocumentReplaced(expectedBasePrivilege, 3, doc, oldDoc);
  });

  it('cannot modify the document type, source, or sourceId', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      sourceId: 'yodlee-id',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      },
      unknownProp: 'some-value'
    };
    var oldDoc = {
      _id: 'biz.3.shoeboxItem.bank-record.WXY',
      type: 'document',
      source: 'yodlee-different',
      sourceId: 'yodlee-id-different',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      },
    };

    businessSyncSpecHelper.verifyDocumentNotReplaced(expectedBasePrivilege, 3, doc, oldDoc, expectedDocType, [ errorFormatter.immutableItemViolation('type'), errorFormatter.immutableItemViolation('source'), errorFormatter.immutableItemViolation('sourceId') ]);
  });

  it('cannot delete a shoebox item document', function() {
    var oldDoc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      },
      unknownProp: 'some-value'
    };

    businessSyncSpecHelper.verifyDocumentNotDeleted(expectedBasePrivilege, 3, oldDoc, expectedDocType, [ errorFormatter.cannotDeleteDocViolation() ]);
  });
});
