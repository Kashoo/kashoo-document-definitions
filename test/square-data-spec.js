var testHelper = require('synctos').testHelper;
var errorFormatter = testHelper.validationErrorFormatter;

var staffChannel = 'STAFF';

describe('square-data database:', function() {
  beforeEach(function() {
    testHelper.initSyncFunction('build/sync-functions/square-data/sync-function.js');
  });

  /* Generic function for doing a set of common tests against a given document type */
  function testDocumentType(basePrivilege, documentIdType) {
    it('successfully creates a valid document', function() {
      // kashooId is omitted from this document to test that the validator will accept that case
      var doc = {
        _id: 'merchant.3.' + documentIdType + '.2',
        id: documentIdType + '-ID',
        entity: { somekey: 'somevalue' }
      };

      verifyDocumentCreated(basePrivilege, 3, doc);
    });

    it('cannot create a document when the fields are of the wrong types', function() {
      var doc = {
        _id: 'merchant.3.' + documentIdType + '.2',
        id: 79,
        kashooId: 'some-string',
        entity: [ 'not', 'the', 'right', 'type' ]
      };

      verifyDocumentNotCreated(
        basePrivilege,
        3,
        doc,
        documentIdType,
        [
          errorFormatter.typeConstraintViolation('id', 'string'),
          errorFormatter.typeConstraintViolation('kashooId', 'integer'),
          errorFormatter.typeConstraintViolation('entity', 'object')
        ]);
    });

    it('cannot create a document that has a non-positive kashooId field', function() {
      var doc = {
        _id: 'merchant.3.' + documentIdType + '.2',
        id: documentIdType + '-ID',
        entity: { somekey: 'somevalue' },
        kashooId: 0
      };

      verifyDocumentNotCreated(basePrivilege, 3, doc, documentIdType, errorFormatter.minimumValueViolation('kashooId', 1));
    });

    it('successfully replaces a valid document', function() {
      var doc = {
        _id: 'merchant.3.' + documentIdType + '.2',
        id: documentIdType + '-ID',
        entity: { somekey: 'somevalue' },
        kashooId: 98230980935
      };
      var oldDoc = { _id: 'merchant.3.' + documentIdType + '.2' };

      verifyDocumentReplaced(basePrivilege, 3, doc, oldDoc);
    });

    it('cannot replace a document when the square entity and ID fields are missing', function() {
      var doc = {
        _id: 'merchant.3.' + documentIdType + '.2',
        kashooId: 78234672
      };
      var oldDoc = { _id: 'merchant.3.' + documentIdType + '.2', };

      verifyDocumentNotReplaced(
        basePrivilege,
        3,
        doc,
        oldDoc,
        documentIdType,
        [ errorFormatter.requiredValueViolation('id'), errorFormatter.requiredValueViolation('entity') ]
      )
    });

    it('successfully deletes a document', function() {
      var oldDoc = {
        _id: 'merchant.8.' + documentIdType + '.2',
        entity: { somekey: 'somevalue' },
        _deleted: true
      };

      verifyDocumentDeleted(basePrivilege, 8, oldDoc);
    });
  };

  describe('fee document definition', function() { testDocumentType('FEE', 'fee') });
  describe('item document definition', function() { testDocumentType('ITEM', 'item') });
  describe('payment document definition', function() { testDocumentType('PAYMENT', 'payment') });
  describe('refund document definition', function() { testDocumentType('REFUND', 'refund') });
  describe('settlement document definition', function() { testDocumentType('SETTLEMENT', 'settlement') });
});

function verifyDocumentCreated(basePrivilegeName, merchantId, doc) {
  testHelper.verifyDocumentCreated(doc, [ staffChannel, merchantId + '-ADD_' + basePrivilegeName ]);
}

function verifyDocumentNotCreated(basePrivilegeName, merchantId, doc, docType, expectedErrorMessages) {
  testHelper.verifyDocumentNotCreated(doc, docType, expectedErrorMessages, [ staffChannel, merchantId + '-ADD_' + basePrivilegeName ]);
}

function verifyDocumentReplaced(basePrivilegeName, merchantId, doc, oldDoc) {
  testHelper.verifyDocumentReplaced(doc, oldDoc, [ staffChannel, merchantId + '-CHANGE_' + basePrivilegeName ]);
}

function verifyDocumentNotReplaced(basePrivilegeName, merchantId, doc, oldDoc, docType, expectedErrorMessages) {
  testHelper.verifyDocumentNotReplaced(doc, oldDoc, docType, expectedErrorMessages, [ staffChannel, merchantId + '-CHANGE_' + basePrivilegeName ]);
}

function verifyDocumentDeleted(basePrivilegeName, merchantId, oldDoc) {
  testHelper.verifyDocumentDeleted(oldDoc, [ staffChannel, merchantId + '-REMOVE_' + basePrivilegeName ]);
}
