var businessSyncSpecHelperMaker = require('./helpers/business-sync-spec-helper-maker.js');
var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('business-sync ohone verification carrier blacklist', function() {
  var testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/business-sync/sync-function.js');
  var businessSyncSpecHelper = businessSyncSpecHelperMaker.init(testFixture);

  afterEach(function() {
    testFixture.resetTestEnvironment();
  });

  var expectedDocType = 'phoneVerificationCarrierBlacklist';
  var expectedBasePrivilege = 'NOTIFICATIONS';

  function verifyBlacklistCreated(doc) {
    testFixture.verifyDocumentCreated(doc, businessSyncSpecHelper.staffChannel);
  }

  function verifyBlacklistReplaced(doc, oldDoc) {
    testFixture.verifyDocumentReplaced(doc, oldDoc, businessSyncSpecHelper.staffChannel);
  }

  function verifyBlacklistDeleted(oldDoc) {
    testFixture.verifyDocumentDeleted(oldDoc, businessSyncSpecHelper.staffChannel);
  }

  function verifyBlacklistNotCreated(doc, expectedErrorMessages) {
    testFixture.verifyDocumentNotCreated(doc, expectedDocType, expectedErrorMessages, businessSyncSpecHelper.staffChannel);
  }

  function verifyBlacklistNotReplaced(doc, oldDoc, expectedErrorMessages) {
    testFixture.verifyDocumentNotReplaced(
      doc,
      oldDoc,
      expectedDocType,
      expectedErrorMessages,
      [ businessSyncSpecHelper.staffChannel ]);
  }

  it('successfully creates a valid blacklist document', function() {
    var doc = {
      _id: 'phoneVerificationCarrierBlacklist',
      blacklist: [
        'a big bad carrier'
      ]
    };

    verifyBlacklistCreated(doc);
  });

  it('cannot create a blacklist document when the properties are invalid', function() {
    var doc = {
      _id: 'phoneVerificationCarrierBlacklist',
      unknownProp: 098234,
      blacklist: [
        '',
        'a big bad carrier'
      ]
    };

    verifyBlacklistNotCreated(
      doc,
      [
        errorFormatter.unsupportedProperty('unknownProp'),
        errorFormatter.mustNotBeEmptyViolation('blacklist[0]'),

      ]);
  });

  it('successfully replaces a valid blacklist document', function() {
    var doc = {
      _id: 'phoneVerificationCarrierBlacklist',
      blacklist: [
        'a big bad carrier',
        'another terrible carrier'
      ]
    };
    var oldDoc = {
      _id: 'phoneVerificationCarrierBlacklist',
      blacklist: [
        'a big bad carrier'
      ]
    };

    verifyBlacklistReplaced(doc, oldDoc);
  });

  it('cannot replace a blacklist document when the properties are invalid', function() {
    var doc = {
      _id: 'phoneVerificationCarrierBlacklist',
      blacklist: [
        'a big bad carrier',
        9983
      ]
    };
    var oldDoc = {
      _id: 'phoneVerificationCarrierBlacklist',
      blacklist: [
        'a big bad carrier'
      ]
    };

    verifyBlacklistNotReplaced(
      doc,
      oldDoc,
      [
        errorFormatter.typeConstraintViolation('blacklist[1]', 'string'),
      ]);
  });

  it('successfully deletes a valid blacklist document', function() {
    var oldDoc = {
      _id: 'phoneVerificationCarrierBlacklist',
      blacklist: [
        'a big bad carrier'
      ]
    };

    verifyBlacklistDeleted(oldDoc);
  });
});
