{
  channels: getDocSyncChannels(doc, oldDoc, 'CUSTOMER_PAYMENT_PROCESSORS'),
  typeFilter: function(doc, oldDoc) {
    return createBusinessEntityRegex('paymentProcessorDefault').test(doc._id);
  },
  propertyValidators: {
    defaultPaymentProcessorId: {
      type: 'string',
      required: false,
      mustNotBeEmpty: true
    }
  }
}
