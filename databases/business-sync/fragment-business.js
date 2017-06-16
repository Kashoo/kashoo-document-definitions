{
  channels: function(doc, oldDoc) {
    var businessId = getBusinessId(doc, oldDoc);

    // Because creating a business config document is not the same as creating a business, reuse the same permission for both creating
    // and updating
    return {
      view: [ toSyncChannel(businessId, 'VIEW'), staffChannel ],
      add: [ toSyncChannel(businessId, 'CHANGE_BUSINESS'), staffChannel ],
      replace: [ toSyncChannel(businessId, 'CHANGE_BUSINESS'), staffChannel ],
      remove: [ toSyncChannel(businessId, 'REMOVE_BUSINESS'), staffChannel ]
    };
  },
  typeFilter: function(doc, oldDoc) {
    return /^biz\.\d+$/.test(doc._id);
  },
  allowAttachments: true,
  attachmentConstraints: {
    // Only the businessLogoAttachment is currently allowed
    maximumAttachmentCount: 1,

    // If support for additional file attachments is added later, each will have to be 100KB or less. This value is explicitly overridden by
    // the businessLogoAttachment property's validator, however.
    maximumIndividualSize: 102400,

    // New attachments will need to have a corresponding attachmentReference property
    requireAttachmentReferences: true
  },
  propertyValidators: {
    businessLogoAttachment: {
      // The name of the Sync Gateway file attachment that is to be used as the business/invoice logo image
      type: 'attachmentReference',
      required: false,
      maximumSize: 2097152,
      supportedExtensions: [ 'png', 'gif', 'jpg', 'jpeg' ],
      supportedContentTypes: [ 'image/png', 'image/gif', 'image/jpeg' ]
    },
    defaultInvoiceTemplate: {
      // Configuration for the default template to use in invoice PDFs
      type: 'object',
      required: false,
      propertyValidators: {
        templateId: {
          type: 'string',
          required: false,
          mustNotBeEmpty: true
        }
      },
    },
    paymentProcessors: {
      // The list of payment processor IDs that are available for the business
      type: 'array',
      required: false,
      arrayElementsValidator: {
        type: 'string',
        required: true,
        mustNotBeEmpty: true
      }
    }
  }
}
