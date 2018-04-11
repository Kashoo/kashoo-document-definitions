var businessSyncSpecHelperMaker = require('./helpers/business-sync-spec-helper-maker.js');
var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('business-sync notification document definition', function() {
  var testFixture, businessSyncSpecHelper;

  beforeEach(function() {
    testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/business-sync/sync-function.js');
    businessSyncSpecHelper = businessSyncSpecHelperMaker.init(testFixture);
  });

  var expectedDocType = 'notification';
  var expectedBasePrivilege = 'NOTIFICATIONS';

  function verifyNotificationCreated(businessId, doc) {
    testFixture.verifyDocumentCreated(doc, businessSyncSpecHelper.staffChannel);
  }

  function verifyNotificationReplaced(businessId, doc, oldDoc) {
    testFixture.verifyDocumentReplaced(doc, oldDoc, [ businessSyncSpecHelper.staffChannel, businessId + '-CHANGE_' + expectedBasePrivilege ]);
  }

  function verifyNotificationDeleted(businessId, oldDoc) {
    testFixture.verifyDocumentDeleted(oldDoc, [ businessSyncSpecHelper.staffChannel, businessId + '-REMOVE_' + expectedBasePrivilege ]);
  }

  function verifyNotificationNotCreated(businessId, doc, expectedErrorMessages) {
    testFixture.verifyDocumentNotCreated(doc, expectedDocType, expectedErrorMessages, businessSyncSpecHelper.staffChannel);
  }

  function verifyNotificationNotReplaced(businessId, doc, oldDoc, expectedErrorMessages) {
    testFixture.verifyDocumentNotReplaced(
      doc,
      oldDoc,
      expectedDocType,
      expectedErrorMessages,
      [ businessSyncSpecHelper.staffChannel, businessId + '-CHANGE_' + expectedBasePrivilege ]);
  }

  it('successfully creates a valid notification document', function() {
    var doc = {
      _id: 'biz.63.notification.5',
      sender: 'test-service',
      type: 'invoice-payments',
      subject: 'pay up!',
      message: 'you best pay up now, or else...',
      createdAt: '2016-02-29T17:13:43.666Z',
      actions: [ { url: 'http://foobar.baz', label: 'pay up here'} ]
    };

    verifyNotificationCreated(63, doc);
  });

  it('cannot create a notification document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.13.notification.5',
      type: true ,
      subject: '', // missing sender, empty subject
      'whatsthis?': 'something I dont recognize!', // unrecognized property
      createdAt: '2016-02-29T25:13:43.666Z', // invalid hour
      firstReadAt: '201-07-14T21:21:21.212-08:00', // invalid year
      actions: [ { url: 24 }, null ] // integer url, non-existent label
    };

    verifyNotificationNotCreated(
      13,
      doc,
      [
        errorFormatter.requiredValueViolation('sender'),
        errorFormatter.typeConstraintViolation('type', 'string'),
        errorFormatter.mustNotBeEmptyViolation('subject'),
        errorFormatter.requiredValueViolation('message'),
        errorFormatter.datetimeFormatInvalid('createdAt'),
        errorFormatter.typeConstraintViolation('actions[0].url', 'string'),
        errorFormatter.requiredValueViolation('actions[0].label'),
        errorFormatter.requiredValueViolation('actions[1]'),
        errorFormatter.unsupportedProperty('whatsthis?'),
        errorFormatter.datetimeFormatInvalid('firstReadAt')
      ]);
  });

  it('successfully replaces a valid notification document', function() {
    var doc = {
      _id: 'biz.7.notification.3',
      type: 'invoice-payments',
      sender: 'test-service',
      subject: 'a different subject',
      message: 'last warning!',
      createdAt: '2016-02-29T17:13:43.666Z',
      firstReadAt: '2016-07-14T21:21:21.212-08:00',
      actions: [ { url: 'http://foobar.baz/lastwarning', label: 'pay up here'} ]
    };
    var oldDoc = {
      _id: 'biz.7.notification.3',
      type: 'invoice-payments',
      sender: 'test-service',
      subject: 'a different subject',
      message: 'last warning!',
      createdAt: '2016-02-29T17:13:43.666Z',
      actions: [ { 'url': 'http://foobar.baz/lastwarning', 'label': 'pay up here'} ]
    };

    verifyNotificationReplaced(7, doc, oldDoc);
  });

  it('cannot replace a notification document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.10.notification.3',
      sender: '', // missing type, empty sender
      message: '', // missing subject, empty message
      createdAt: '2016-04-29T17:13:43.666Z', // changed createdAt
      firstReadAt: '2016-07-14T21:24:16.997-08:00',
      actions: [ { label: ''} ]
    };
    var oldDoc = { // valid oldDoc
      _id: 'biz.10.notification.3',
      type: 'invoice-payments',
      sender: 'test-service',
      subject: 'a different subject',
      message: 'last warning!',
      createdAt: '2016-02-29T17:13:43.666Z',
      firstReadAt: '2016-07-14T21:21:21.212-08:00',
      actions: [ { url: 'http://foobar.baz/lastwarning', label: 'pay up here'} ]
    };

    verifyNotificationNotReplaced(
      10,
      doc,
      oldDoc,
      [
        errorFormatter.immutableItemViolation('sender'),
        errorFormatter.mustNotBeEmptyViolation('sender'),
        errorFormatter.immutableItemViolation('type'),
        errorFormatter.requiredValueViolation('type'),
        errorFormatter.immutableItemViolation('subject'),
        errorFormatter.requiredValueViolation('subject'),
        errorFormatter.immutableItemViolation('message'),
        errorFormatter.mustNotBeEmptyViolation('message'),
        errorFormatter.immutableItemViolation('createdAt'),
        errorFormatter.immutableItemViolation('actions'),
        errorFormatter.requiredValueViolation('actions[0].url'),
        errorFormatter.mustNotBeEmptyViolation('actions[0].label'),
        errorFormatter.immutableItemViolation('firstReadAt')
      ]);
  });

  it('successfully deletes a valid notification document', function() {
    var oldDoc = {
      _id: 'biz.71.notification.5',
      type: 'invoice-payments',
      sender: 'test-service',
      subject: 'pay up!',
      message: 'you best pay up now, or else...',
      createdAt: '2016-02-29T17:13:43.666Z',
      actions: [ { url: 'http://foobar.baz', label: 'pay up here'} ]
    };

    verifyNotificationDeleted(71, oldDoc);
  });
});
