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

  var staffChannel = 'STAFF';
  var expectedPrivilege = '4444-CHANGE_BUSINESS';
  var expectedPrivileges = [ staffChannel, expectedPrivilege ];
  var expectedDocType = 'reports';

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

    testFixture.verifyDocumentCreated(doc, expectedPrivileges);
  });

  it('can create an empty reports document', function() {
    var doc = {
      _id: 'biz.4444.reports',
      reports: []
    };

    testFixture.verifyDocumentCreated(doc, expectedPrivileges);
  });

  it('cannot create a reports document with missing reports item', function () {
    var doc = {
      _id: 'biz.4444.reports'
    };

    testFixture.verifyDocumentNotCreated(
        doc,
        expectedDocType,
        [
          nullConstraint('reports')
        ],
        expectedPrivileges);
  });

  it('cannot create a reports document with an invalid reports list', function () {
    var doc = {
      _id: 'biz.4444.reports',
      reports: 'foo'
    };

    testFixture.verifyDocumentNotCreated(
        doc,
        expectedDocType,
        [
          errorFormatter.typeConstraintViolation('reports', 'array'),
        ],
        expectedPrivileges);
  });

  it('cannot create a reports document with empty report objects', function () {
    var doc = {
      _id: 'biz.4444.reports',
      reports: [
        {}
      ]
    };

    testFixture.verifyDocumentNotCreated(
        doc,
        expectedDocType,
        [
          nullConstraint('reports[0].id'),
          nullConstraint('reports[0].name'),
          nullConstraint('reports[0].type'),
          nullConstraint('reports[0].config')
        ],
        expectedPrivileges);
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

    testFixture.verifyDocumentNotCreated(
        doc,
        expectedDocType,
        [
          errorFormatter.mustNotBeEmptyViolation('reports[0].id'),
          errorFormatter.typeConstraintViolation('reports[0].name', 'string'),
          errorFormatter.enumPredefinedValueViolation('reports[0].type', [ 'balance-sheet', 'cash-flow', 'insights', 'profit-and-loss', 'sales-tax' ]),
          errorFormatter.typeConstraintViolation('reports[0].config', 'object')
        ],
        expectedPrivileges);
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

    testFixture.verifyDocumentReplaced(doc, oldDoc, expectedPrivileges);
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

    testFixture.verifyDocumentReplaced(doc, oldDoc, expectedPrivileges);
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

    testFixture.verifyDocumentReplaced(doc, oldDoc, expectedPrivileges);
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

    testFixture.verifyDocumentReplaced(doc, oldDoc, expectedPrivileges);
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

    testFixture.verifyDocumentNotReplaced(
      doc,
      oldDoc,
      expectedDocType,
      [
        nullConstraint('reports[0].config')
      ],
      expectedPrivileges);
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

    testFixture.verifyDocumentNotDeleted(
      doc,
      expectedDocType,
      [ errorFormatter.cannotDeleteDocViolation() ],
      expectedPrivileges);
  });
});
