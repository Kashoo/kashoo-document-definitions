{
  channels: function(doc, oldDoc) {
    var businessId = getBusinessId(doc, oldDoc);

    return {
      view: [ toSyncChannel(businessId, 'VIEW'), staffChannel ],
      add: [ toSyncChannel(businessId, 'CHANGE_BUSINESS'), staffChannel ],
      replace: [ toSyncChannel(businessId, 'CHANGE_BUSINESS'), staffChannel ],
      remove: [ toSyncChannel(businessId, 'REMOVE_BUSINESS'), staffChannel ]
    };
  },
  typeFilter: function(doc, oldDoc) {
    return createBusinessEntityRegex('menuPreferences').test(doc._id);
  },
  propertyValidators: {
    navigationSectionsOrder: {
      // simple field defining the order of the navigation menu sections
      type: 'array',
      required: true,
      arrayElementsValidator: {
        type: 'string',
        required: true,
        mustNotBeEmpty: true
      }
    }
  }
}
