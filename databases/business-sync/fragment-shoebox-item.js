{
  channels: getDocSyncChannels(doc, oldDoc, 'SHOEBOX_ITEMS'),
  typeFilter: function(doc, oldDoc) {
    // Keyspace schema:  biz.<biz_id>.shoeboxItem.<item_type>.<uuid>
    return createBusinessEntityRegex('shoeboxItem\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+').test(doc._id);
  },
  allowUnknownProperties: true,
  cannotDelete: function(doc, oldDoc) {
    // Allowed to delete document items and bank import items, nothing else.
    return !(oldDoc.type === 'document' || (oldDoc.type === 'bank' && oldDoc.source === 'import'));
  },
  propertyValidators: {
    type: {
      // The type of shoebox item (bank transaction, uploaded document, email)
      type: 'enum',
      predefinedValues: [ 'bank', 'document', 'email', 'manual-entry', 'payment', 'payment-deposit' ],
      required: true,
      immutable: true
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
    state: {
      // The shoebox item's state within the shoebox processing pipeline.
      //   ready: the item is ready to be processed by the user in the inbox
      //   processed: the item has been processed and added to books
      type: 'enum',
      predefinedValues: [ 'ready', 'processed' ],
      required: true
    },
    received: {
      // The time at which the data was received by the shoebox
      type: 'datetime',
      skipValidationWhenValueUnchangedStrict: true,
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
            skipValidationWhenValueUnchangedStrict: true,
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
    // map of annotations by 'data type' key -> array of annotations of that type
    annotations: {
      type: 'hashtable',
      hashtableKeysValidator: {
        mustNotBeEmpty: false,
          regexPattern: new RegExp('^association$|^metadata$|^record$|^partial-record$|^classification$|^classification-suggestion$|^match-suggestion$')
      },
      hashtableValuesValidator: {
        type: 'array',
        required: true,
        mustNotBeEmpty: true,
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
              predefinedValues: [ 'association', 'metadata', 'record', 'partial-record', 'classification', 'classification-suggestion', 'match-suggestion' ]
            },
            // payload, pretty much unrestricted at this point
            data: {
              type: 'object',
              required: true
            },
            // Array of timestamp and user IDs of modifications to this annotation
            // Refinement:  constrained to a single element, meaning no modifications are expected
            // and changes to an annotation should be made as a new annotation
            modifications: {
              type: 'array',
              mustNotBeEmpty: true,
              required: true,
              maximumLength: 1,
              arrayElementsValidator: {
                type: 'object',
                // immutable: true,  hesitant to enable this.  It would require that clients ensure this array remains sorted by chronologically by timestamp.
                propertyValidators: {
                  source: { // source of the annotation
                    type: 'object',
                      required: true,
                      propertyValidators: {
                      type: {
                        type: 'string',
                          required: true,
                          mustNotBeEmpty: true
                      },
                      id: {
                        type: 'string',
                          required: true,
                          mustNotBeEmpty: true
                      }
                    }
                  },
                  timestamp: {
                    type: 'datetime',
                    skipValidationWhenValueUnchangedStrict: true,
                    required: true
                  }
                }
              }
            }
          }
        }
      }
    },
    // indicating whether a record has been processed
    processed: {
      type: 'object',
      required: false,
      propertyValidators: {
        source: { // source of the decision/processing
          type: 'object',
          required: true,
          propertyValidators: {
            type: {
              type: 'string',
              required: true,
              mustNotBeEmpty: true
            },
            id: {
              type: 'string',
              required: true,
              mustNotBeEmpty: true
            }
          }
        },
        timestamp: {
          type: 'datetime',
          skipValidationWhenValueUnchangedStrict: true,
          required: true
        }
      }
    }
  }
}
