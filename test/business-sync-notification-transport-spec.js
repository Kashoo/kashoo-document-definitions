var businessSyncSpecHelperMaker = require('./helpers/business-sync-spec-helper-maker.js');
var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('business-sync notification transport document definition', function() {
  var testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/business-sync/sync-function.js');
  var businessSyncSpecHelper = businessSyncSpecHelperMaker.init(testFixture);

  afterEach(function() {
    testFixture.resetTestEnvironment();
  });

  var expectedDocType = 'notificationTransport';
  var expectedBasePrivilege = 'NOTIFICATIONS_CONFIG';

  it('successfully creates a valid notification transport document', function() {
    var doc = {
      _id: 'biz.82.notificationTransport.ABC',
      type: 'email',
      recipient: 'foo.bar@example.com'
    };

    businessSyncSpecHelper.verifyDocumentCreated(expectedBasePrivilege, 82, doc);
  });

  it('cannot create a notification transport document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.75.notificationTransport.ABC',
      recipient: ''
    };

    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      75,
      doc,
      expectedDocType,
      [ errorFormatter.requiredValueViolation('type'), errorFormatter.mustNotBeEmptyViolation('recipient') ]);
  });

  it('successfully replaces a valid notification transport document', function() {
    var doc = {
      _id: 'biz.38.notificationTransport.ABC',
      type: 'email',
      recipient: 'different.foo.bar@example.com'
    };
    var oldDoc = {
      _id: 'biz.38.notificationTransport.ABC',
      type: 'email',
      recipient: 'foo.bar@example.com'
    };

    businessSyncSpecHelper.verifyDocumentReplaced(expectedBasePrivilege, 38, doc, oldDoc);
  });

  it('cannot replace a notification transport document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.73.notificationTransport.ABC',
      type: 23,
    };
    var oldDoc = {
      _id: 'biz.73.notificationTransport.ABC',
      type: 'email',
      recipient: 'foo.bar@example.com'
    };

    businessSyncSpecHelper.verifyDocumentNotReplaced(
      expectedBasePrivilege,
      73,
      doc,
      oldDoc,
      expectedDocType,
      [ errorFormatter.typeConstraintViolation('type', 'string'), errorFormatter.requiredValueViolation('recipient') ]);
  });

  it('successfully deletes a notification transport document', function() {
    var oldDoc = {
      _id: 'biz.14.notificationTransport.ABC',
      type: 'email',
      recipient: 'different.foo.bar@example.com'
    };

    businessSyncSpecHelper.verifyDocumentDeleted(expectedBasePrivilege, 14, oldDoc);
  });
});
