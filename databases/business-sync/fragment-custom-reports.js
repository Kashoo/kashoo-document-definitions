{
  channels: getDocSyncChannels(doc, oldDoc, 'REPORTS'),
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
            predefinedValues: [ 'balance-sheet', 'cash-flow', 'general-ledger', 'insights', 'profit-and-loss', 'sales-tax' ],
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
