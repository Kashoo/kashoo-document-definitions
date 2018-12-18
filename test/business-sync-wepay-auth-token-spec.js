var businessSyncSpecHelperMaker = require('./helpers/business-sync-spec-helper-maker.js');
var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('business-sync wepay auth token document definition', function() {
  var testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/business-sync/sync-function.js');
  var businessSyncSpecHelper = businessSyncSpecHelperMaker.init(testFixture);

  afterEach(function() {
    testFixture.resetTestEnvironment();
  });

  it('successfully creates a valid wepay auth token document', function() {
    var doc = {
      _id: 'biz.4444.wepay.12345.auth',
      user_id: 12345,
      access_token: "some-token"
    };

    testFixture.verifyDocumentAccepted(doc, null, businessSyncSpecHelper.staffChannel);
  });

  it('cannot create a payment processing attempt document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.4444.wepay.12345.auth',
      user_id: "sfasfd",
      access_token: ""
    };
    expectedErrorMessages = [
      errorFormatter.typeConstraintViolation('user_id', 'integer'),
      errorFormatter.mustNotBeEmptyViolation('access_token')
    ]
    testFixture.verifyDocumentRejected(doc, null, 'wepayAuthToken', expectedErrorMessages, businessSyncSpecHelper.staffChannel);
  });
});
