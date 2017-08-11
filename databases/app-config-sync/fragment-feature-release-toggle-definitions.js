{
  channels: {
    view: [ 'view-feature-release-toggle-definitions', 'view-config' ],
    add: [ 'edit-feature-release-toggle-definitions', 'edit-config' ],
    replace: [ 'edit-feature-release-toggle-definitions', 'edit-config' ],
    remove: [ 'remove-feature-release-toggle-definitions', 'remove-config' ]
  },
  typeFilter: function(doc, oldDoc) {
    return doc._id === 'featureReleaseToggleDefinitions';
  },
  propertyValidators: {
    toggles: {
      // A list of the feature toggles defined for the application.
      type: 'array',
      arrayElementsValidator: {
        type: 'object',
        required: true,
        propertyValidators: {
          // The name of the feature toggle, as used within applications.
          name: {
            type: 'string',
            required: true,
            mustNotBeEmpty: true,
            regexPattern: featureToggleNameRegex
          },
          // A description of the feature toggle for documentation within the feature toggle manager.
          description: {
            type: 'string',
            required: true,
            mustNotBeEmpty: true
          },
          // The ticket id related to the feature toggle, for example KBW-1234
          ticketId: {
            type: 'string'
          },
          // The state of the feature toggle.
          state: {
            type: 'enum',
            predefinedValues: [ 'development', 'ready', 'remove' ],
            required: true
          },
          // Any extra notes about the feature toggle
          note: {
            type: 'string'
          }
        }
      }
    }
  }
}
