var testHelper = require('synctos').testHelper;
var errorFormatter = testHelper.validationErrorFormatter;

var staffChannel = 'STAFF';
var documentType = 'squareData';

describe('business-sync square data entity: ', function() {
  beforeEach(function() {
    testHelper.initSyncFunction('build/sync-functions/business-sync/sync-function.js');
  });

  /* Generic function for doing a set of common tests against a given document type */
  function testDocumentType(documentIdType) {
    it('successfully creates a valid document', function() {
      // kashooId is omitted from this document to test that the validator will accept that case
      var doc = {
        _id: 'merchant.3.biz.1234.' + documentIdType + '.2',
        id: documentIdType + '-ID',
        entity: { somekey: 'somevalue' }
      };

      verifyDocumentCreated('3', doc);
    });

    it('cannot create a document when the fields are of the wrong types', function() {
      var doc = {
        _id: 'merchant.3.biz.1234.' + documentIdType + '.2',
        id: 79,
        kashooId: 'some-string',
        entity: [ 'not', 'the', 'right', 'type' ]
      };

      verifyDocumentNotCreated('3',
        doc,
        documentType,
        [
          errorFormatter.typeConstraintViolation('id', 'string'),
          errorFormatter.typeConstraintViolation('kashooId', 'integer'),
          errorFormatter.typeConstraintViolation('entity', 'object')
        ]);
    });

    it('cannot create a document that has a non-positive kashooId field', function() {
      var doc = {
        _id: 'merchant.3.biz.1234.' + documentIdType + '.2',
        id: documentIdType + '-ID',
        entity: { somekey: 'somevalue' },
        kashooId: 0
      };

      verifyDocumentNotCreated('3', doc, documentType, errorFormatter.minimumValueViolation('kashooId', 1));
    });

    it('successfully replaces a valid document', function() {
      var doc = {
        _id: 'merchant.3.biz.1234.' + documentIdType + '.2',
        id: documentIdType + '-ID',
        entity: { somekey: 'somevalue' },
        kashooId: 98230980935
      };
      var oldDoc = { _id: 'merchant.3.' + documentIdType + '.2' };

      verifyDocumentReplaced('3', doc, oldDoc);
    });

    it('cannot replace a document when the square entity and ID fields are missing', function() {
      var doc = {
        _id: 'merchant.3.biz.1234.' + documentIdType + '.2',
        kashooId: 78234672
      };
      var oldDoc = { _id: 'merchant.3.biz.1234.' + documentIdType + '.2', };

      verifyDocumentNotReplaced('3',
        doc,
        oldDoc,
        documentType,
        [ errorFormatter.requiredValueViolation('id'), errorFormatter.requiredValueViolation('entity') ]
      )
    });

    it('successfully deletes a document', function() {
      var oldDoc = {
        _id: 'merchant.8.biz.1234.' + documentIdType + '.2',
        entity: { somekey: 'somevalue' },
        _deleted: true
      };

      verifyDocumentDeleted('8', oldDoc);
    });
  };

  describe('fee document definition', function() { testDocumentType('fee') });
  describe('item document definition', function() { testDocumentType('item') });
  describe('payment document definition', function() { testDocumentType('payment') });
  describe('refund document definition', function() { testDocumentType('refund') });
  describe('settlement document definition', function() { testDocumentType('settlement') });
});

function verifyDocumentCreated(merchantId, doc) {
  testHelper.verifyDocumentCreated(doc, [ staffChannel, merchantId ]);
}

function verifyDocumentNotCreated(merchantId, doc, docType, expectedErrorMessages) {
  testHelper.verifyDocumentNotCreated(doc, docType, expectedErrorMessages, [ staffChannel, merchantId ]);
}

function verifyDocumentReplaced(merchantId, doc, oldDoc) {
  testHelper.verifyDocumentReplaced(doc, oldDoc, [ staffChannel, merchantId ]);
}

function verifyDocumentNotReplaced(merchantId, doc, oldDoc, docType, expectedErrorMessages) {
  testHelper.verifyDocumentNotReplaced(doc, oldDoc, docType, expectedErrorMessages, [ staffChannel, merchantId ]);
}

function verifyDocumentDeleted(merchantId, oldDoc) {
  testHelper.verifyDocumentDeleted(oldDoc, [ staffChannel, merchantId ]);
}
