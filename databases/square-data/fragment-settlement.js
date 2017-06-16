{
  channels: getDocSyncChannels(doc, oldDoc, 'SETTLEMENT'),
  typeFilter: function(doc, oldDoc) {
    return createMerchantEntityRegex('settlement\\.[A-Za-z0-9_-]+').test(doc._id);
  },
  propertyValidators: sharedPropertyValidators
}
