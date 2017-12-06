{
  channels: {
    view: [ 'view-announcements', 'view-config' ],
    add: [ 'edit-announcements', 'edit-config' ],
    replace: [ 'edit-announcements', 'edit-config' ],
    remove: [ 'remove-announcements', 'remove-config' ]
  },
  typeFilter: function(doc, oldDoc) {
    return doc._id === 'announcements';
  },
  propertyValidators: {
    loginAnnouncement: {
      type: 'object',
      propertyValidators: {
        title: {
          type: 'string'
        },
        message: {
          type: 'string',
          mustNotBeEmpty: true,
          required: true
        },
        link: {
          type: 'string'
        }
      }
    }
  }
}
