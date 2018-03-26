/**
 * Initialize a collection of helper functions to be used when validating the business-sync document definitions.
 *
 * @param {Object} testFixture The test fixture to use
 */
exports.init = function(testFixture) {
  var staffChannel = exports.staffChannel = 'STAFF';

  return {
    staffChannel: staffChannel,

    verifyDocumentCreated: function(basePrivilegeName, businessId, doc) {
      testFixture.verifyDocumentCreated(doc, [ staffChannel, businessId + '-ADD_' + basePrivilegeName ]);
    },

    verifyDocumentReplaced: function(basePrivilegeName, businessId, doc, oldDoc) {
      testFixture.verifyDocumentReplaced(doc, oldDoc, [ staffChannel, businessId + '-CHANGE_' + basePrivilegeName ]);
    },

    verifyDocumentDeleted: function(basePrivilegeName, businessId, oldDoc) {
      testFixture.verifyDocumentDeleted(oldDoc, [ staffChannel, businessId + '-REMOVE_' + basePrivilegeName ]);
    },

    verifyDocumentNotCreated: function(basePrivilegeName, businessId, doc, expectedDocType, expectedErrorMessages) {
      testFixture.verifyDocumentNotCreated(
        doc,
        expectedDocType,
        expectedErrorMessages,
        [ staffChannel, businessId + '-ADD_' + basePrivilegeName ]);
    },

    verifyDocumentNotReplaced: function(basePrivilegeName, businessId, doc, oldDoc, expectedDocType, expectedErrorMessages) {
      testFixture.verifyDocumentNotReplaced(
        doc,
        oldDoc,
        expectedDocType,
        expectedErrorMessages,
        [ staffChannel, businessId + '-CHANGE_' + basePrivilegeName ]);
    },

    verifyDocumentNotDeleted: function(basePrivilegeName, businessId, doc, expectedDocType, expectedErrorMessages) {
      testFixture.verifyDocumentNotDeleted(
        doc,
        expectedDocType,
        expectedErrorMessages,
        [ staffChannel, businessId + '-REMOVE_' + basePrivilegeName ]);
    }
  };
};
