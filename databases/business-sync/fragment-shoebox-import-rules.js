{
  channels: getDocSyncChannels(doc, oldDoc, 'SHOEBOX_ITEMS'),
  typeFilter: function(doc, oldDoc) {
    // Keyspace schema:  biz.<biz_id>.shoebox.importRules
    return createBusinessEntityRegex('shoebox.importRules').test(doc._id);
  },
  allowUnknownProperties: false,
  cannotDelete: true,
  propertyValidators: {
    // hashtable of rules: ID -> rule
    rules: {
      type: 'hashtable',
      hashtableKeysValidator: {
        mustNotBeEmpty: true
      },
      hashtableValuesValidator: {
        type: 'object',
        required: true,
        // rule schema
        propertyValidators: {
          criteria: {
            type: 'array',
            mustNotBeEmpty: true,
            arrayElementsValidator: {
              type: 'object',
              required: true,
              propertyValidators: {
                comparison: {
                  // Comparison operation.  This will be specific to the field (ie, comparison on the amount field will be numerical)
                  type: 'enum',
                  predefinedValues: [ 'contains' ],
                  required: true
                },
                field: {
                  // The field to inspect for comparison
                  type: 'enum',
                  predefinedValues: [ 'description' ],
                  required: true
                },
                // the value to use in the comparison.
                // Omits type which is implied by the field (ie, description field expects a string value to compare against)
                value: {
                  type: 'string', // synctos does not support ambiguous types, but the intended type can be inferred from the field
                  mustNotBeEmpty: true,
                  required: true
                }
              }
            }
          },
          suggestions: {
            type: 'array',
            required: true,
            mustNotBeEmpty: true,
            arrayElementsValidator: {
              type: 'object',
              required: true,
              allowUnknownProperties: true,
              propertyValidators: {
                // Name of the field the suggestion is intended for.  Field name should imply expected type.
                suggestedField: {
                  type: 'enum',
                  predefinedValues: [ 'accountNumber', 'taxIds' ],
                  required: true
                }
                // // Value of the suggestion
                // suggestedValue: {
                //   type: 'string', // synctos does not support ambiguous types, but the intended type can be inferred from the field
                //   required: true
                // }
              }
            }
          },
          // indicates whether this rule has been 'removed' by the user
          removed: {
            type: 'boolean',
            required: true
          }
        }
      }
    }
  }
}
