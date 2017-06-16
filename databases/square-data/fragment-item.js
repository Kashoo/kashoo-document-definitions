{
  channels: getDocSyncChannels(doc, oldDoc, 'ITEM'),
  typeFilter: function(doc, oldDoc) {
    return createMerchantEntityRegex('item\\.[A-Za-z0-9_-]+').test(doc._id);
  },
  propertyValidators: sharedPropertyValidators
}
