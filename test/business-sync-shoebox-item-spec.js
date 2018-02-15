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

  it('successfully creates a shoebox item document with a missing previous data field and a collection of valid annotations', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      sourceId: '1239004',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      },
      annotations: [
        {
          type: 'embedded',
          dataType: 'user-metadata',
          data: {
            'some-metadata-field': 'some random user provided metadata',
            'another-field': 'more data'
          },
          modifications: [
            {
              timestamp: '2017-02-18T18:57:35.328-08:00',
              userId: 1234
            }
          ]
        }
      ],
      processed: {
        userId: 333,
        timestamp: '2017-02-18T18:57:35.328-08:00'
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
      data: 2.4,
      annotations: 'a string annotation field',
      processed: 1233
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
        errorFormatter.typeConstraintViolation('data', 'object'),
        errorFormatter.typeConstraintViolation('annotations', 'array'),
        errorFormatter.typeConstraintViolation('processed', 'object'),
      ]);
  });

  it('cannot create a shoebox item document with an invalid annotation', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'email',
      source: 'email-server',
      sourceId: '1239004',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      },
      annotations: [
        {
          type: 'some-unsupported-type',
          dataType: 'some-unsupported-data-type',
          // missing data field
          modifications: [
            { userId: 0, timestamp: 'not-a-date' }, // user Id cannot be 0, timestamp not valid format
            { timestamp: 444 } // missing userId, timestamp not a string
          ]
        }
      ],
      processed: {
        userId: 34.5,
        timestamp: "not-a-timestampt"
      }
    };

    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      3,
      doc,
      expectedDocType,
      [
        errorFormatter.enumPredefinedValueViolation('annotations[0].type', [ 'embedded' ]),
        errorFormatter.enumPredefinedValueViolation('annotations[0].dataType', [ 'user-metadata' ]),
        errorFormatter.requiredValueViolation('annotations[0].data'),
        errorFormatter.minimumValueExclusiveViolation('annotations[0].modifications[0].userId', 0),
        errorFormatter.datetimeFormatInvalid('annotations[0].modifications[0].timestamp'),
        errorFormatter.typeConstraintViolation('annotations[0].modifications[1].timestamp', 'datetime'),
        errorFormatter.requiredValueViolation('annotations[0].modifications[1].userId'),
        errorFormatter.datetimeFormatInvalid('processed.timestamp', 'datetime'),
        errorFormatter.typeConstraintViolation('processed.userId', 'integer'),
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
