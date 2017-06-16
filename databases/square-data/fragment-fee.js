{
  channels: getDocSyncChannels(doc, oldDoc, 'FEE'),
  typeFilter: function(doc, oldDoc) {
    return createMerchantEntityRegex('fee\\.[A-Za-z0-9_-]+').test(doc._id);
  },
  propertyValidators: sharedPropertyValidators
}
