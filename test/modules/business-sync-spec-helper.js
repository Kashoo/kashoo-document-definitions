// This module contains a collection of functions to be used when validating the business-sync document definitions

var testHelper = require('synctos').testHelper;

var staffChannel = exports.staffChannel = 'STAFF';

exports.verifyDocumentCreated = function(basePrivilegeName, businessId, doc) {
  testHelper.verifyDocumentCreated(doc, [ staffChannel, businessId + '-ADD_' + basePrivilegeName ]);
};

exports.verifyDocumentReplaced = function(basePrivilegeName, businessId, doc, oldDoc) {
  testHelper.verifyDocumentReplaced(doc, oldDoc, [ staffChannel, businessId + '-CHANGE_' + basePrivilegeName ]);
};

exports.verifyDocumentDeleted = function(basePrivilegeName, businessId, oldDoc) {
  testHelper.verifyDocumentDeleted(oldDoc, [ staffChannel, businessId + '-REMOVE_' + basePrivilegeName ]);
};

exports.verifyDocumentNotCreated = function(basePrivilegeName, businessId, doc, expectedDocType, expectedErrorMessages) {
  testHelper.verifyDocumentNotCreated(
    doc,
    expectedDocType,
    expectedErrorMessages,
    [ staffChannel, businessId + '-ADD_' + basePrivilegeName ]);
};

exports.verifyDocumentNotReplaced = function(basePrivilegeName, businessId, doc, oldDoc, expectedDocType, expectedErrorMessages) {
  testHelper.verifyDocumentNotReplaced(
    doc,
    oldDoc,
    expectedDocType,
    expectedErrorMessages,
    [ staffChannel, businessId + '-CHANGE_' + basePrivilegeName ]);
};

exports.verifyDocumentNotDeleted = function(basePrivilegeName, businessId, doc, expectedDocType, expectedErrorMessages) {
  testHelper.verifyDocumentNotDeleted(
    doc,
    expectedDocType,
    expectedErrorMessages,
    [ staffChannel, businessId + '-REMOVE_' + basePrivilegeName ]);
};
