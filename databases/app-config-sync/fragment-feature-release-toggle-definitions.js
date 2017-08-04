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
      // A list of actions that are available to the recipient of the notification
      type: 'array',
      arrayElementsValidator: {
        type: 'object',
        required: true,
        propertyValidators: {
          name: {
            type: 'string',
            required: true,
            mustNotBeEmpty: true,
            regexPattern: featureToggleNameRegex
          },
          description: {
            type: 'string',
            required: true,
            mustNotBeEmpty: true
          },
          ticketId: {
            // the ticket id related to the feature toggle, for example KBW-1234
            type: 'string'
          },
          state: {
            type: 'enum',
            predefinedValues: [ 'development', 'ready', 'remove' ],
            required: true
          },
          note: {
            // Any extra notes about the feature toggle
            type: 'string'
          }
        }
      }
    }
  }
}
