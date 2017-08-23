function() {
  // The channel that is only applicable to Kashoo staff and services
  var staffChannel = 'STAFF';

  // Matches values that look like three-letter ISO 4217 currency codes. It is not comprehensive.
  var iso4217CurrencyCodeRegex = /^[A-Z]{3}$/;

  // Creates a RegExp to match the ID of an entity that belongs to a business
  function createBusinessEntityRegex(suffixPattern) {
    // Note that this regex uses double quotes rather than single quotes as a workaround to https://github.com/Kashoo/synctos/issues/116
    return new RegExp("^biz\\.\\d+\\." + suffixPattern + "$");
  }

  // Retrieves the ID of the business to which the document belongs
  function getBusinessId(doc, oldDoc) {
    var regex = /^biz\.(\d+)(?:\..+)?$/;
    var matchGroups = regex.exec(doc._id);
    if (matchGroups) {
      return matchGroups[1];
    } else if (oldDoc && oldDoc.businessId) {
      // The document ID doesn't contain a business ID, so use the property from the old document
      return oldDoc.businessId || null;
    } else {
      // Neither the document ID nor the old document's contents contain a business ID, so use the property from the new document
      return doc.businessId || null;
    }
  }

  // Converts a Books business privilege to a Couchbase Sync Gateway document channel name
  function toSyncChannel(businessId, privilege) {
    return businessId + '-' + privilege;
  }

  // Builds a function that returns the view, add, replace, remove channels extrapolated from the specified base privilege, name which is
  // formatted according to the de facto Books convention of "VIEW_FOOBAR", "ADD_FOOBAR", "CHANGE_FOOBAR" and "REMOVE_FOOBAR" assuming the
  // base privilege name is "FOOBAR". If basePrivilegeName is omitted, only the write channel configuration is set (and only to the "STAFF"
  // channel).
  function getDocSyncChannels(doc, oldDoc, basePrivilegeName) {
    var businessId = getBusinessId(doc, oldDoc);

    return function(doc, oldDoc) {
      if (basePrivilegeName) {
        return {
          view: [ toSyncChannel(businessId, 'VIEW_' + basePrivilegeName), staffChannel ],
          add: [ toSyncChannel(businessId, 'ADD_' + basePrivilegeName), staffChannel ],
          replace: [ toSyncChannel(businessId, 'CHANGE_' + basePrivilegeName), staffChannel ],
          remove: [ toSyncChannel(businessId, 'REMOVE_' + basePrivilegeName), staffChannel ]
        };
      } else {
        return { write: staffChannel };
      }
    };
  }

  // The document type definitions. For everyone's sanity, please keep the document types in case-insensitive alphabetical order
  return {
    // The base business configuration. Should not be expanded with new properties unless they are directly related to the existing
    // properties so as to keep the document type from becoming even more of a dumping ground for general business configuration, which
    // makes it more difficult to resolve sync conflicts. Instead, create a new document type.
    business: importDocumentDefinitionFragment('fragment-business.js'),

    // simple document storing navigation menu section order preferences
    menuPreferences: importDocumentDefinitionFragment('fragment-business-menu-preferences.js'),

    // A collection of references to Kashoo co-branded merchant accounts for a business
    merchantAccountsReference: importDocumentDefinitionFragment('fragment-merchant-accounts-reference.js'),

    // A notification to be delivered to the registered notification transports for the corresponding notification type
    notification: importDocumentDefinitionFragment('fragment-notification.js'),

    // Configuration of notification transports for the business
    notificationsConfig: importDocumentDefinitionFragment('fragment-notifications-config.js'),

    // Keeps track of all notifications that have been generated for a business
    notificationsReference: importDocumentDefinitionFragment('fragment-notifications-reference.js'),

    // Configuration for a notification transport
    notificationTransport: importDocumentDefinitionFragment('fragment-notification-transport.js'),

    // A summary of the progress of processing and sending a notification via a specific notification transport method
    notificationTransportProcessingSummary: importDocumentDefinitionFragment('fragment-notification-transport-processing-summary.js'),

    // Describes an attempt to pay an invoice payment requisition, whether successful or not. May not be replaced or deleted once created.
    paymentAttempt: importDocumentDefinitionFragment('fragment-payment-attempt.js'),

    // Describes a processed settlement from a payment processor
    paymentProcessorSettlement: importDocumentDefinitionFragment('fragment-payment-processor-settlement.js')(),

    // Default business payment processor document
    paymentProcessorBusinessDefault: importDocumentDefinitionFragment('fragment-payment-processor-business-default.js'),

    // Default customer payment processor reference document
    paymentProcessorCustomerDefault: importDocumentDefinitionFragment('fragment-payment-processor-customer-default.js'),

    // Configuration for a payment processor
    paymentProcessorDefinition: importDocumentDefinitionFragment('fragment-payment-processor-definition.js'),

    // A request/requisition for payment of an invoice
    paymentRequisition: importDocumentDefinitionFragment('fragment-payment-requisition.js'),

    // References the payment requisitions and payment attempts that were created for an invoice
    paymentRequisitionsReference: importDocumentDefinitionFragment('fragment-payment-requisitions-reference.js'),

    // Generic document for storing outside sourced data
    shoeboxSnippet: importDocumentDefinitionFragment('fragment-shoebox-snippet.js')
  };
}
