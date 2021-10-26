var businessSyncSpecHelperMaker = require('./helpers/business-sync-spec-helper-maker.js');
var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('business-sync custom reports document definition', function() {
  var testFixture, businessSyncSpecHelper;

  beforeEach(function() {
    testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/business-sync/sync-function.js');
    businessSyncSpecHelper = businessSyncSpecHelperMaker.init(testFixture);
  });

  var expectedBasePrivilege = 'REPORTS';
  var expectedDocType = 'reports';
  var businessId = 4444;

  function nullConstraint (name) {
    return 'item "' + name + '" must not be null or missing'
  }

  it('can create a valid reports document', function() {
    var doc = {
      _id: 'biz.4444.reports',
      reports: [
        {
          id: 'uuid',
          name: 'foo',
          type: 'balance-sheet',
          config: {
            foo: 'bar'
          }
        }
      ]
    };

    businessSyncSpecHelper.verifyDocumentCreated(expectedBasePrivilege, businessId, doc);
  });

  it('can create an empty reports document', function() {
    var doc = {
      _id: 'biz.4444.reports',
      reports: []
    };

    businessSyncSpecHelper.verifyDocumentCreated(expectedBasePrivilege, businessId, doc);
  });

  it('cannot create a reports document with missing reports item', function () {
    var doc = {
      _id: 'biz.4444.reports'
    };

    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      businessId,
      doc,
      expectedDocType,
      [
        nullConstraint('reports')
      ]);
  });

  it('cannot create a reports document with an invalid reports list', function () {
    var doc = {
      _id: 'biz.4444.reports',
      reports: 'foo'
    };

    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      businessId,
      doc,
      expectedDocType,
      [
        errorFormatter.typeConstraintViolation('reports', 'array'),
      ]);
  });

  it('cannot create a reports document with empty report objects', function () {
    var doc = {
      _id: 'biz.4444.reports',
      reports: [
        {}
      ]
    };

    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      businessId,
      doc,
      expectedDocType,
      [
        nullConstraint('reports[0].id'),
        nullConstraint('reports[0].name'),
        nullConstraint('reports[0].type'),
        nullConstraint('reports[0].config')
      ]);
  });

  it('cannot create a reports document with an invalid report objects', function () {
    var doc = {
      _id: 'biz.4444.reports',
      reports: [
        {
          id: '',
          name: 12,
          type: 'foo',
          config: 12
        }
      ]
    };

    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      businessId,
      doc,
      expectedDocType,
      [
        errorFormatter.mustNotBeEmptyViolation('reports[0].id'),
        errorFormatter.typeConstraintViolation('reports[0].name', 'string'),
        errorFormatter.enumPredefinedValueViolation('reports[0].type', [ 'balance-sheet', 'cash-flow', 'general-ledger', 'insights', 'profit-and-loss', 'sales-tax', 'trial-balance' ]),
        errorFormatter.typeConstraintViolation('reports[0].config', 'object')
      ]);
  });

  it('can modify a reports document to add a new report', function () {
    var doc = {
      _id: 'biz.4444.reports',
      reports: [
        {
          id: 'uuid',
          name: 'foo',
          type: 'balance-sheet',
          config: {
            foo: 'bar'
          }
        }
      ]
    };

    var oldDoc = {
      _id: 'biz.4444.reports',
      reports: []
    };

    businessSyncSpecHelper.verifyDocumentReplaced(expectedBasePrivilege, businessId, doc, oldDoc);
  });

  it('can modify a reports document to update a report', function () {
    var doc = {
      _id: 'biz.4444.reports',
      reports: [
        {
          id: 'uuid',
          name: 'bar',
          type: 'cash-flow',
          config: {
            foo: 'baz'
          }
        }
      ]
    };

    var oldDoc = {
      _id: 'biz.4444.reports',
      reports: [
        {
          id: 'uuid',
          name: 'foo',
          type: 'balance-sheet',
          config: {
            foo: 'bar'
          }
        }
      ]
    };

    businessSyncSpecHelper.verifyDocumentReplaced(expectedBasePrivilege, businessId, doc, oldDoc);
  });

  it('can modify a reports document to remove a report', function () {
    var doc = {
      _id: 'biz.4444.reports',
      reports: []
    };

    var oldDoc = {
      _id: 'biz.4444.reports',
      reports: [
        {
          id: 'uuid',
          name: 'foo',
          type: 'balance-sheet',
          config: {
            foo: 'bar'
          }
        }
      ]
    };

    businessSyncSpecHelper.verifyDocumentReplaced(expectedBasePrivilege, businessId, doc, oldDoc);
  });

  it('can modify a reports document to replace a report', function () {
    var doc = {
      _id: 'biz.4444.reports',
      reports: [
        {
          id: 'uuid',
          name: 'bar',
          type: 'cash-flow',
          config: {
            foo: 'baz'
          }
        }
      ]
    };

    var oldDoc = {
      _id: 'biz.4444.reports',
      reports: [
        {
          id: 'uuid2',
          name: 'baz',
          type: 'balance-sheet',
          config: {
            foo: 'bar'
          }
        }
      ]
    };

    businessSyncSpecHelper.verifyDocumentReplaced(expectedBasePrivilege, businessId, doc, oldDoc);
  });

  it('cannot modify a reports document with an invalid reports doc', function () {
    var doc = {
      _id: 'biz.4444.reports',
      reports: [
        {
          id: 'uuid',
          name: 'bar',
          type: 'cash-flow',
        }
      ]
    };

    var oldDoc = {
      _id: 'biz.4444.reports',
      reports: [
        {
          id: 'uuid2',
          name: 'baz',
          type: 'balance-sheet',
          config: {
            foo: 'bar'
          }
        }
      ]
    };

    businessSyncSpecHelper.verifyDocumentNotReplaced(
      expectedBasePrivilege,
      businessId,
      doc,
      oldDoc,
      expectedDocType,
      [
        nullConstraint('reports[0].config')
      ]);
  });

  it('cannot delete a reports document', function() {
    var doc = {
      _id: 'biz.4444.reports',
      reports: [
        {
          id: 'uuid2',
          name: 'baz',
          type: 'balance-sheet',
          config: {
            foo: 'bar'
          }
        }
      ]
    };

    businessSyncSpecHelper.verifyDocumentNotDeleted(
      expectedBasePrivilege,
      businessId,
      doc,
      expectedDocType,
      [
        errorFormatter.cannotDeleteDocViolation()
      ]);
  });
});
