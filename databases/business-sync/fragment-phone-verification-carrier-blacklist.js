{
  channels: function(doc, oldDoc) {
    // Only staff/service users can create, replace or delete blacklist documents to prevent regular users from tampering
    return {
      view: staffChannel,
      write: staffChannel
    };
  },
  typeFilter: function(doc, oldDoc) {
    return /^phoneVerificationCarrierBlacklist$/.test(doc._id);
  },
  propertyValidators: {
    blacklist: {
      type: 'array',
      required: true,
      minimumLength: 1,
      arrayElementsValidator: {
        type: 'string',
        mustNotBeEmpty: true
      }
    }
  }
}
