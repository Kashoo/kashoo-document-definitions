{
  channels: {
    view: [ 'view-feature-release-toggle-definitions', 'view-config' ],
    add: [ 'edit-feature-release-toggle-definitions', 'edit-config' ],
    replace: [ 'edit-feature-release-toggle-definitions', 'edit-config' ],
    remove: [ 'remove-feature-release-toggle-definitions', 'remove-config' ]
  },
  typeFilter: function(doc, oldDoc) {
    // Example valid document IDs: "feature-release-toggle.foo-toggle", "feature-release-toggle.bar_1"
    return /^feature-release-toggle\.[a-z0-9_-]+$/.test(doc._id);
  },
  propertyValidators: {
    name: {
      type: 'string',
      required: true,
      mustNotBeEmpty: true,
      immutableWhenSet: true,
      regexPattern: /^[a-z0-9_-]+$/
    },
    description: {
      type: 'string',
      required: true,
      mustNotBeEmpty: true
    },
    jira: {
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
}
