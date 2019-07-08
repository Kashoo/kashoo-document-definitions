var businessSyncSpecHelperMaker = require('./helpers/business-sync-spec-helper-maker.js');
var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('business-sync shoebox item document definition', function() {
  var testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/business-sync/sync-function.js');
  var businessSyncSpecHelper = businessSyncSpecHelperMaker.init(testFixture);

  afterEach(function() {
    testFixture.resetTestEnvironment();
  });

  var expectedDocType = 'shoeboxItem';
  var expectedBasePrivilege = 'SHOEBOX_ITEMS';

  it('successfully creates a valid shoebox item document', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      sourceId: '1239004',
      state: 'ready',
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

  it('successfully creates a shoebox item document with an empty state', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      sourceId: '1239004',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      }
    };

    businessSyncSpecHelper.verifyDocumentCreated(expectedBasePrivilege, 3, doc);
  });

  it('successfully creates a shoebox item document with a missing previous data field and a collection of valid annotations', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      sourceId: '1239004',
      state: 'ready',
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
      state: 'invalid',
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
        errorFormatter.enumPredefinedValueViolation('type', [ 'bank', 'document', 'email', 'manual-entry' ]),
        errorFormatter.mustNotBeEmptyViolation('source'),
        errorFormatter.typeConstraintViolation('sourceId', 'string'),
        errorFormatter.enumPredefinedValueViolation('state', [ 'ready', 'processed', 'before-opening' ]),
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
      state: 'ready',
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
        errorFormatter.maximumLengthViolation('annotations[metadata][0].modifications', 1),
        errorFormatter.enumPredefinedValueViolation('annotations[metadata][0].type', [ 'embedded' ]),
        errorFormatter.enumPredefinedValueViolation('annotations[metadata][0].dataType', [ 'association', 'metadata', 'record', 'partial-record', 'classification', 'classification-suggestion', 'match-suggestion' ]),
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
      state: 'ready',
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
        errorFormatter.enumPredefinedValueViolation('type', [ 'bank', 'document', 'email', 'manual-entry' ])
      ]);
  });

  it('can successfully replace a valid shoebox item document', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      state: 'ready',
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
              'some-metadata-field': 'actually, no, something totally different',
              'another-field': 'more data, but different'
            },
            modifications: [
              {
                timestamp: '2017-02-19T18:57:35.328-08:00',
                source: {
                  type: 'books-user',
                  id: '1998485'
                }
              }
            ]
          },
          {
            type: 'embedded',
            dataType: 'metadata',
            data: {
              'some-metadata-field': 'some random user provided metadata - thats changed!',
              'another-field': 'more data'
            },
            modifications: [
              {
                timestamp: '2016-02-18T18:57:35.328-08:00',
                source: {
                  type: 'books-user',
                  id: '1944485'
                }
              }
            ]
          }
        ],
        'match-suggestion': [
          {
            type: 'embedded',
            dataType: 'match-suggestion',
            data: {
              'suggestions': ['doc1', 'doc2']
            },
            modifications: [
              {
                timestamp: '2017-02-19T18:57:35.328-08:00',
                source: {
                  type: 'books-user',
                  id: '1998485'
                }
              }
            ]
          }
        ]
      },
      previousData: [
        {
          received: '2016-06-18T18:57:35.328-08:00',
          data: {
            foo: 'baz'
          }
        }
      ],
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
      },
      unknownProp: 'some-value'
    };
    var oldDoc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      state: 'ready',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'baz'
      },
    };

    businessSyncSpecHelper.verifyDocumentReplaced(expectedBasePrivilege, 3, doc, oldDoc);
  });

  it('can successfully "process" a valid shoebox item document', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      state: 'ready',
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
      state: 'ready',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'baz'
      }
    };

    businessSyncSpecHelper.verifyDocumentReplaced(expectedBasePrivilege, 3, doc, oldDoc);
  });

  it('can change shoebox item document state', function() {
    var doc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      state: 'before-opening',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      }
    };
    var oldDoc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      state: 'ready',
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
      state: 'ready',
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
      state: 'ready',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      },
    };

    businessSyncSpecHelper.verifyDocumentNotReplaced(expectedBasePrivilege, 3, doc, oldDoc, expectedDocType, [ errorFormatter.immutableItemViolation('type'), errorFormatter.immutableItemViolation('source'), errorFormatter.immutableItemViolation('sourceId') ]);
  });

  it('can delete a document type shoebox item document', function() {
    var oldDoc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'document',
      source: 'yodlee',
      state: 'ready',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      },
      unknownProp: 'some-value'
    };

    businessSyncSpecHelper.verifyDocumentDeleted(expectedBasePrivilege, 3, oldDoc );
  });

  it('can delete a bank import shoebox item document', function() {
      var oldDoc = {
        _id: 'biz.3.shoeboxItem.bank-record.XYZ',
        type: 'bank',
        source: 'import',
        state: 'ready',
        received: '2016-06-18T18:57:35.328-08:00',
        data: {
          foo: 'bar'
        },
        unknownProp: 'some-value'
      };

      businessSyncSpecHelper.verifyDocumentDeleted(expectedBasePrivilege, 3, oldDoc );
    });

  it('cannot delete a bank type shoebox item document', function() {
    var oldDoc = {
      _id: 'biz.3.shoeboxItem.bank-record.XYZ',
      type: 'bank',
      source: 'yodlee',
      state: 'ready',
      received: '2016-06-18T18:57:35.328-08:00',
      data: {
        foo: 'bar'
      },
      unknownProp: 'some-value'
    };

    businessSyncSpecHelper.verifyDocumentNotDeleted(expectedBasePrivilege, 3, oldDoc, expectedDocType, [ errorFormatter.cannotDeleteDocViolation() ]);
  });
});
