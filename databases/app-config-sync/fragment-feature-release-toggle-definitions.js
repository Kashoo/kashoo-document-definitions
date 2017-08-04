function() {
  var typeRegexMatchGroups = featureToggleNameRegex.exec(doc._id);
  var PROCESSOR_ID_MATCH_GROUP = 1;

  return {
    channels: {
      view: [ 'view-feature-release-toggle-definitions', 'view-config' ],
      add: [ 'edit-feature-release-toggle-definitions', 'edit-config' ],
      replace: [ 'edit-feature-release-toggle-definitions', 'edit-config' ],
      remove: [ 'remove-feature-release-toggle-definitions', 'remove-config' ]
    },
    typeFilter: function(doc, oldDoc) {
      // Example valid document IDs: "feature-release-toggle.foo-toggle", "feature-release-toggle.bar_1"
      return new RegExp('^feature-release-toggle\.' + featureToggleNamePattern + '$').test(doc._id);
    },
    propertyValidators: {
      name: {
        type: 'string',
        required: true,
        mustNotBeEmpty: true,
        immutable: true,
        regexPattern: featureToggleNameRegex
      },
      description: {
        type: 'string',
        required: true,
        mustNotBeEmpty: true
      },
      ticketId: {
        type: 'string'
      },
      state: {
        type: 'enum',
        predefinedValues: [ 'development', 'ready', 'remove' ],
        required: true
      },
      note: {
        type: 'string'
      }
    }
  };
}
