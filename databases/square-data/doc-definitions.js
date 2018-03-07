function() {
  // The channel that is only applicable to Kashoo staff and services
  var staffChannel = 'STAFF';

  // Creates a RegExp to match the ID of an entity that belongs to a merchant
  function createMerchantEntityRegex(suffixPattern) {
    // Note that this regex uses double quotes rather than single quotes as a workaround to https://github.com/Kashoo/synctos/issues/116
    return new RegExp("^merchant\\.[A-Za-z0-9_-]+(\\.biz\\.[0-9]+)?\\." + suffixPattern + "$");
  }

  // Retrieves the ID of the merchant to which the document belongs based on its document ID
  function getMerchantId(doc) {
    var regex = /^merchant\.([A-Za-z0-9_-]+)(?:\..+)?$/;
    var matchGroups = regex.exec(doc._id);

    return matchGroups ? matchGroups[1] : null;
  }

  // Converts a Books business privilege to a Couchbase Sync Gateway document channel name
  function toSyncChannel(merchantId, privilege) {
    return merchantId + '-' + privilege;
  }

  // Builds a function that returns the view, add, replace, remove channels extrapolated from the specified base privilege, name which is
  // formatted according to the de facto Books convention of "VIEW_FOOBAR", "ADD_FOOBAR", "CHANGE_FOOBAR" and "REMOVE_FOOBAR" assuming the
  // base privilege name is "FOOBAR". If basePrivilegeName is omitted, only the write channel configuration is set (and only to the "STAFF"
  // channel).
  function getDocSyncChannels(doc, oldDoc, basePrivilegeName) {
    var merchantId = getMerchantId(doc);

    return function(doc, oldDoc) {
      if (basePrivilegeName) {
        return {
          view: [ toSyncChannel(merchantId, 'VIEW_' + basePrivilegeName), staffChannel ],
          add: [ toSyncChannel(merchantId, 'ADD_' + basePrivilegeName), staffChannel ],
          replace: [ toSyncChannel(merchantId, 'CHANGE_' + basePrivilegeName), staffChannel ],
          remove: [ toSyncChannel(merchantId, 'REMOVE_' + basePrivilegeName), staffChannel ]
        };
      } else {
        return { write: staffChannel };
      }
    };
  }

  var sharedPropertyValidators = {
    id: {
      type: 'string',
      required: true,
      mustNotBeEmpty: true
    },
    kashooId: {
      type: 'integer',
      minimumValue: 1
    },
    entity: {
      type: 'object',
      required: true,
      allowUnknownProperties: true
    },
    lastModified: {
      type: 'datetime',
      required: true
    },
    processingFailure: {
      type: 'string',
      mustNotBeEmpty: true
    }
  };

  // The document type definitions. For everyone's sanity, please keep the document types in case-insensitive alphabetical order
  return {
    fee: importDocumentDefinitionFragment('fragment-fee.js'),

    item: importDocumentDefinitionFragment('fragment-item.js'),

    payment: importDocumentDefinitionFragment('fragment-payment.js'),

    refund: importDocumentDefinitionFragment('fragment-refund.js'),

    settlement: importDocumentDefinitionFragment('fragment-settlement.js')
  };
}
