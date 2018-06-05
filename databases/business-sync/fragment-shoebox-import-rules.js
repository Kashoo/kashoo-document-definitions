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
        // ID is used to refer to a rule in annotations that pertain to it.  It should be a string UUID
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
              propertyValidators: function(doc, oldDoc, value, oldValue) {
                // the value to use in the comparison.  Type is dependent on the comparison operator
                var valueValidator = {
                  type: value.comparison === 'contains' ? 'string' : 'array',
                  mustNotBeEmpty: true,
                  required: true
                };
                if (value.comparison === 'containsAll') {
                  valueValidator.arrayElementsValidator = {
                    type: 'string',
                    mustNotBeEmpty: true
                  };
                }
                return {
                  comparison: {
                    // Comparison operation.  This will be specific to the field (ie, comparison on the amount field will be numerical)
                    type: 'enum',
                    predefinedValues: [ 'contains', 'containsAll' ],
                    required: true
                  },
                  field: {
                    // The field to inspect for comparison
                    type: 'enum',
                    predefinedValues: [ 'description' ],
                    required: true
                  },
                  value: valueValidator
                };
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
              propertyValidators: function(doc, oldDoc, value, oldValue) {
                return {
                  // Name of the field the suggestion is intended for.  Field name should imply expected type.
                  suggestedField: {
                    type: 'enum',
                    predefinedValues: [ 'accountNumber', 'taxIds' ],
                    required: true
                  },
                  // Value of the suggestion
                  suggestedValue: {
                    type: value.suggestedField === 'accountNumber' ? 'string' : 'array',
                    required: true
                  }
                };
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
