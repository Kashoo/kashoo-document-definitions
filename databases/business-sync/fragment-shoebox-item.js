{
  channels: getDocSyncChannels(doc, oldDoc, 'SHOEBOX_ITEMS'),
  typeFilter: function(doc, oldDoc) {
    // Keyspace schema:  biz.<biz_id>.shoeboxItem.<item_type>.<uuid>
    return createBusinessEntityRegex('shoeboxItem\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+').test(doc._id);
  },
  allowUnknownProperties: true,
  cannotDelete: true,
  propertyValidators: {
    type: {
      // The type of shoebox item (ie, bank transaction, email, photo, digital receipt)
      type: 'string',
      required: true,
      immutable: true,
      mustNotBeEmpty: true
    },
    source: {
      // The source of the item
      type: 'string',
      required: true,
      immutable: true,
      mustNotBeEmpty: true
    },
    sourceId: {
      type: 'string',
      immutable: true,
      mustNotBeEmpty: true
    },
    received: {
      // Time at which the data was received
      type: 'datetime',
      required: true
    },
    data: {
      // Document describing the data
      type: 'object',
      required: true,
      allowUnknownProperties: true
    },
    previousData: {
      type: 'array',
      arrayElementsValidator: {
        type: 'object',
        required: true,
        propertyValidators: {
          received: {
            // Time at which the data was received
            type: 'datetime',
            required: true
          },
          data: {
            // Document describing the data
            type: 'object',
            required: true,
            allowUnknownProperties: true
          }
        }
      }
    }
  }
}
