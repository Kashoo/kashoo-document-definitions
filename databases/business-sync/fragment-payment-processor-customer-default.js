{
  channels: getDocSyncChannels(doc, oldDoc, 'CONTACTS'),
  typeFilter: function(doc, oldDoc) {
    return createBusinessEntityRegex('customer\\.[0-9]+\\.defaultPaymentProcessor').test(doc._id);
  },
  propertyValidators: {
    // default payment processor
    defaultPaymentProcessor: {
      type: 'string',
      required: true,
      mustNotBeEmpty: true
    }
  }
}
