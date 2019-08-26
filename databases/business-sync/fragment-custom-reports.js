{
  channels: function(doc, oldDoc) {
    var businessId = getBusinessId(doc, oldDoc);
    return {
      view: [ toSyncChannel(businessId, 'VIEW'), staffChannel ],
      add: [ toSyncChannel(businessId, 'CHANGE_BUSINESS'), staffChannel ],
      replace: [ toSyncChannel(businessId, 'CHANGE_BUSINESS'), staffChannel ],
      remove: [ toSyncChannel(businessId, 'CHANGE_BUSINESS'), staffChannel ]
    };
  },
  typeFilter: function(doc, oldDoc) {
    // Keyspace schema:  biz.<biz_id>.reports
    return createBusinessEntityRegex('reports').test(doc._id);
  },
  allowUnknownProperties: false,
  cannotDelete: true,
  propertyValidators: {
    reports: {
      type: 'array',
      required: true,
      arrayElementsValidator: {
        type: 'object',
        required: true,
        propertyValidators: {
          id: {
            type: 'string',
            required: true,
            mustNotBeEmpty: true
          },
          name: {
            type: 'string',
            required: true,
            mustNotBeEmpty: true
          },
          type: {
            type: 'enum',
            predefinedValues: [ 'balance-sheet', 'cash-flow', 'insights', 'profit-and-loss', 'sales-tax' ],
            required: true
          },
          config: {
            type: 'object',
            required: true,
            allowUnknownProperties: true
          }
        }
      }
    }
  }
}
