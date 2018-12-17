{
  typeFilter: function(doc, oldDoc) {
    return createBusinessEntityRegex('wepay\.[A-Za-z0-9_-]+\.auth$').test(doc._id);
  },
  channels: { write: staffChannel },
  propertyValidators: {
    user_id: {
      type: 'integer',
      required: true,
      minimumValue: 1
    },
    access_token: {
      type: 'string',
      required: true,
      mustNotBeEmpty: true
    },
    token_type: {
      type: 'string',
      required: false
    },
    expires_in: {
      type: 'integer',
      required: false,
      minimumValue: 1
    }
  }
}
