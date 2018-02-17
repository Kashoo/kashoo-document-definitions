{
  channels: {
    view: [ 'view-feature-release-toggles', 'view-config' ],
    add: [ 'edit-feature-release-toggles', 'edit-config' ],
    replace: [ 'edit-feature-release-toggles', 'edit-config' ],
    remove: [ 'remove-feature-release-toggles', 'remove-config' ]
  },
  typeFilter: function(doc, oldDoc) {
    return doc._id === 'featureReleaseToggles';
  },
  propertyValidators: {
    enabledFeatures: {
      type: 'array',
      required: true,
      arrayElementsValidator: {
        type: 'string',
        mustNotBeEmpty: true,
        required: true,
        regexPattern: featureToggleNameRegex
      }
    }
  }
}
