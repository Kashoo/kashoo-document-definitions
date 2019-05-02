{
  channels: function(doc, oldDoc) {
    // Only staff/service users can create, replace or delete payment attempts to prevent regular users from tampering
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
      // The ID of the business with which the payment attempt is associated
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
