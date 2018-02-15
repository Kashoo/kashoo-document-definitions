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
      // The type of shoebox item (bank transaction, uploaded document, email)
      type: 'enum',
      predefinedValues: [ 'bank', 'document', 'email' ],
      required: true,
      immutable: true,
      mustNotBeEmpty: true
    },
    source: {
      // The source of the item (yodlee, shoebox-ui...)
      type: 'string',
      required: true,
      immutable: true,
      mustNotBeEmpty: true
    },
    sourceId: {
      // The unique id given to the item by the source
      type: 'string',
      immutable: true,
      mustNotBeEmpty: true
    },
    received: {
      // The time at which the data was received by the shoebox
      type: 'datetime',
      required: true
    },
    data: {
      // Document describing the data (this is determined by the source and isn't important to the shoebox).
      // If this data is updated by the source, this property should be updated to the most recent value and the previous
      // data should be moved to the previousData property.
      type: 'object',
      required: true,
      allowUnknownProperties: true
    },
    previousData: {
      // If the data changes after it was put in the shoebox, this array stores the previous values that were originally
      // stored as a historical reference.
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
    },
    annotations: {
      type: 'array',
      required: false,
      arrayElementsValidator: {
        type: 'object',
        required: true,
        propertyValidators: {
          // indicates what type of annotation this is
          // Only embedded is supported to start
          type: {
            type: 'enum',
            immutable: true,
            required: true,
            predefinedValues: [ 'embedded' ]
          },
          // a simple tag describing what type data this annotation is
          // example:  'user-metadata', 'ocr-analysis', 'model-XYZ-classification'
          dataType: {
            type: 'enum',
            immutable: true,
            required: true,
            predefinedValues: [ 'user-metadata' ]
          },
          // payload, pretty much unrestricted at this point
          data: {
            type: 'object',
            required: true
          },
          // timestamp recording when this annotation was last updated
          lastModified: {
            type: 'datetime',
            required: true
          },
          // ID of the annotating user
          annotatingUser: {
            type: 'integer',
            minimumValueExclusive: 0,
            required: true
          }
        }
      }
    },
    // indicating whether a record has been processed
    processed: {
      type: 'boolean',
      required: false
    }
  }
}
