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
      annotations: {
        metadata: [
          {
            type: 'embedded',
            dataType: 'metadata',
            data: {
              'some-metadata-field': 'some random user provided metadata',
              'another-field': 'more data'
            },
            modifications: [
              {
                timestamp: '2017-02-18T18:57:35.328-08:00',
                source: {
                  type: 'books-user',
                  id: '1998485'
                }
              }
            ]
          }
        ],
        classification: [
          {
            type: 'embedded',
            dataType: 'classification',
            data: {
              accountId: 1234,
              contactId: 4321
            },
            modifications: [
              {
                timestamp: '2018-01-19T12:00:35.000-11:00',
                source: {
                  type: 'books-user',
                  id: '1998485'
                }
              }
            ]
          }
        ]
      },
      processed: {
        source: {
          type: 'books-user',
          id: '1998485'
        },
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
        errorFormatter.typeConstraintViolation('annotations', 'hashtable'),
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
      annotations: {
        metadata: [
          {
            type: 'some-unsupported-type',
            dataType: 'some-unsupported-data-type',
            // missing data field
            modifications: [
              { source: 0, timestamp: 'not-a-date' }, // source should be object, timestamp not valid format
              { timestamp: 444 } // missing source, timestamp not a string
            ]
          }
        ]
      },
      processed: {
        source: {
          id: '' // missing type field
        },
        timestamp: "not-a-timestampt"
      }
    };

    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      3,
      doc,
      expectedDocType,
      [
        errorFormatter.enumPredefinedValueViolation('annotations[metadata][0].type', [ 'embedded' ]),
        errorFormatter.enumPredefinedValueViolation('annotations[metadata][0].dataType', [ 'metadata', 'record', 'partial-record', 'classification' ]),
        errorFormatter.requiredValueViolation('annotations[metadata][0].data'),
        errorFormatter.typeConstraintViolation('annotations[metadata][0].modifications[0].source', 'object'),
        errorFormatter.datetimeFormatInvalid('annotations[metadata][0].modifications[0].timestamp'),
        errorFormatter.requiredValueViolation('annotations[metadata][0].modifications[1].source'),
        errorFormatter.typeConstraintViolation('annotations[metadata][0].modifications[1].timestamp', 'datetime'),
        errorFormatter.requiredValueViolation('annotations[metadata][0].modifications[1].source'),
        errorFormatter.datetimeFormatInvalid('annotations[metadata][0].modifications[1].timestamp'),
        errorFormatter.datetimeFormatInvalid('processed.timestamp'),
        errorFormatter.mustNotBeEmptyViolation('processed.source.id'),
        errorFormatter.requiredValueViolation('processed.source.type'),
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

  it('cannot replace a processed shoebox item document', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      },
      unknownProp: 'some-value',
      processed: {
        timestamp: '2016-06-20T18:00:00.000-08:00',
        source: {
          id: '23489',
          type: 'books.user'
        }
      }
    };
    var oldDoc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'baz'
      },
      processed: {
        timestamp: '2016-06-20T18:00:00.000-08:00',
        source: {
          id: '23489',
          type: 'books.user'
        }
      }
    };

    businessSyncSpecHelper.verifyDocumentNotReplaced(expectedBasePrivilege, 3, doc, oldDoc, expectedDocType, [ errorFormatter.immutableDocViolation() ]);
  });

  it('can successfully "process" a valid shoebox item document', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      },
      processed: {
        timestamp: '2016-06-20T18:00:00.000-08:00',
        source: {
          id: '23489',
          type: 'books.user'
        }
      }
    };
    var oldDoc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'baz'
      }
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

  it('cannot delete a processed shoebox item document', function() {
    var oldDoc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      },
      unknownProp: 'some-value',
      processed: {
        timestamp: '2016-06-20T18:00:00.000-08:00',
        source: {
          id: '23489',
          type: 'books.user'
        }
      }
    };

    businessSyncSpecHelper.verifyDocumentNotDeleted(expectedBasePrivilege, 3, oldDoc, expectedDocType, [ errorFormatter.immutableDocViolation() ]);
  });
});
