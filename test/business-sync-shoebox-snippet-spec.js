var businessSyncSpecHelper = require('./modules/business-sync-spec-helper.js');
var testHelper = require('../node_modules/synctos/etc/test-helper.js');
var errorFormatter = testHelper.validationErrorFormatter;

describe('business-sync shoebox snippet document definition', function() {
  beforeEach(function() {
    testHelper.init('build/sync-functions/business-sync/sync-function.js');
  });

  var expectedDocType = 'shoeboxSnippet';
  var staffPrivilege = 'STAFF';

  it('successfully creates a valid shoebox snippet document', function() {
    var doc = {
      _id: 'biz.3.shoeboxSnippet.bank-record.XYZ',
      type: 'bank-record',
      source: 'yodlee',
      kashooEntityType: 'record',
      kashooId: 23456,
      data: '{ "bank-rec": "data" }',
      unknownProp: 'some-value'
    };

    testHelper.verifyDocumentCreated(doc, [ staffPrivilege ]);
  });

  it('cannot create a shoebox snippet document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.1.shoeboxSnippet.bank-record.XYZ',
      type: 4,
      source: '',
      kashooId: '23456',
      data: 2.4,
    };

    testHelper.verifyDocumentNotCreated(
      doc,
      expectedDocType,
      [
        errorFormatter.typeConstraintViolation('type', 'string'),
        errorFormatter.mustNotBeEmptyViolation('source'),
        errorFormatter.typeConstraintViolation('kashooId', 'integer'),
        errorFormatter.typeConstraintViolation('data', 'string'),
      ],
      [ staffPrivilege ]);
  });

  it('cannot replace a valid shoebox snippet document', function() {
    var doc = {
      _id: 'biz.3.shoeboxSnippet.bank-record.XYZ',
      type: 'bank-record',
      source: 'yodlee',
      kashooEntityType: 'record',
      kashooId: 23456,
      data: '{ "bank-rec": "changed data" }',
      unknownProp: 'some-value'
    };
    var oldDoc = {
      _id: 'biz.3.shoeboxSnippet.bank-record.XYZ',
      type: 'bank-record',
      source: 'yodlee',
      kashooEntityType: 'record',
      kashooId: 23456,
      data: '{ "bank-rec": "data" }',
      unknownProp: 'some-value'
    };

    testHelper.verifyDocumentNotReplaced(doc, oldDoc, expectedDocType, [ errorFormatter.immutableDocViolation() ], [ staffPrivilege ]);
  });

  it('cannot delete a shoebox snippet document', function() {
    var oldDoc = {
      _id: 'biz.3.shoeboxSnippet.bank-record.XYZ',
      type: 'bank-record',
      source: 'yodlee',
      kashooEntityType: 'record',
      kashooId: 23456,
      data: '{ "bank-rec": "data" }',
      unknownProp: 'some-value'
    };

    testHelper.verifyDocumentNotDeleted(oldDoc, expectedDocType, [ errorFormatter.immutableDocViolation() ], [ staffPrivilege ]);
  });
});
