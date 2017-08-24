{
  channels: getDocSyncChannels(doc, oldDoc),
  typeFilter: function(doc, oldDoc) {
    // Keyspace schema:  biz.<biz_id>.shoeboxItem.<item_type>.<uuid>
    return createBusinessEntityRegex('shoeboxItem\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+').test(doc._id);
  },
  allowUnknownProperties: true,
  immutable: true,
  propertyValidators: {
    type: {
      // The type of shoebox item (ie, bank transaction, email, photo, digital receipt)
      type: 'string',
      required: true,
      mustNotBeEmpty: true
    },
    source: {
      // The source of the item
      type: 'string',
      required: true,
      mustNotBeEmpty: true
    },
    sourceId: {
      type: 'string',
      required: false,
      mustNotBeEmpty: true
    },
    received: {
      // Time at which the data was received
      type: 'datetime',
      required: true
    },
    data: {
      // Raw data of the item
      type: 'string',
      required: true,
      mustNotBeEmpty: true
    }
  }
}
