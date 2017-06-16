{
  channels: getDocSyncChannels(doc, oldDoc, 'REFUND'),
  typeFilter: function(doc, oldDoc) {
    return createMerchantEntityRegex('refund\\.[A-Za-z0-9_-]+').test(doc._id);
  },
  propertyValidators: sharedPropertyValidators
}
