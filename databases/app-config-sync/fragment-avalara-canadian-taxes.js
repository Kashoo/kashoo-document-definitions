{
  channels: {
    view: 'view-config',
    add: 'edit-config',
    replace: 'edit-config',
    remove: 'remove-config'
  },
  typeFilter: function(doc, oldDoc) {
    return /^avalara-canadian-taxes$/.test(doc._id);
  },
  allowUnknownProperties: true,
  propertyValidators: {
  }
}
