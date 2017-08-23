{
  channels: getDocSyncChannels(doc, oldDoc),
  typeFilter: function(doc, oldDoc) {
    return createBusinessEntityRegex('shoeboxSnippet\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+').test(doc._id);
  },
  allowUnknownProperties: true,
  immutable: true,
  propertyValidators: {
    type: {
      // The type of shoebox snippet (ie, bank transaction, email, photo, digital receipt)
      type: 'string',
      required: true,
      mustNotBeEmpty: true
    },
    source: {
      // The source of the snippet
      type: 'string',
      required: true,
      mustNotBeEmpty: true
    },
    kashooEntityType: {
      // Type of corresponding Books entity
      type: 'string',
      required: false,
      mustNotBeEmpty: true
    },
    kashooId: {
      // The ID of the corresponding Books entity
      type: 'integer',
      required: false,
      minimumValue: 1
    },
    data: {
      // Raw data of the snippet
      type: 'string',
      required: true,
      mustNotBeEmpty: true
    }
  }
}
