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
              propertyValidators: {
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
                value: {
                  // the value to use in the comparison.  Type is dependent on the comparison operator
                  type: 'conditional',
                  required: true,
                  validationCandidates: [
                    {
                      condition: function(doc, oldDoc, currentItemEntry, validationItemStack) {
                        var parentObj = validationItemStack[validationItemStack.length - 1].itemValue;

                        return parentObj.comparison === 'contains';
                      },
                      validator: {
                        type: 'string',
                        mustNotBeEmpty: true
                      }
                    },
                    {
                      condition: function(doc, oldDoc, currentItemEntry, validationItemStack) {
                        var parentObj = validationItemStack[validationItemStack.length - 1].itemValue;

                        return parentObj.comparison === 'containsAll';
                      },
                      validator: {
                        type: 'array',
                        mustNotBeEmpty: true,
                        arrayElementsValidator: {
                          type: 'string',
                          mustNotBeEmpty: true
                        }
                      }
                    }
                  ]
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
                },
                // Value of the suggestion
                suggestedValue: {
                  type: 'conditional',
                  required: true,
                  validationCandidates: [
                    {
                      condition: function(doc, oldDoc, currentItemEntry, validationItemStack) {
                        var parentObj = validationItemStack[validationItemStack.length - 1].itemValue;

                        return parentObj.suggestedField === 'accountNumber';
                      },
                      validator: {
                        type: 'string',
                        mustNotBeEmpty: true
                      }
                    },
                    {
                      condition: function(doc, oldDoc, currentItemEntry, validationItemStack) {
                        var parentObj = validationItemStack[validationItemStack.length - 1].itemValue;

                        return parentObj.suggestedField === 'taxIds';
                      },
                      validator: {
                        type: 'array',
                        mustNotBeEmpty: true,
                        arrayElementsValidator: {
                          type: 'integer',
                          minimumValueExclusive: 0
                        }
                      }
                    }
                  ]
                }
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
