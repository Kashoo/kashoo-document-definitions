{
  channels: getDocSyncChannels(doc, oldDoc, 'PAYMENT'),
  typeFilter: function(doc, oldDoc) {
    return createMerchantEntityRegex('payment\\.[A-Za-z0-9_-]+').test(doc._id);
  },
  propertyValidators: sharedPropertyValidators
}
