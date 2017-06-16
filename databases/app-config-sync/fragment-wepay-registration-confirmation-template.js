{
  channels: {
    view: 'view-config',
    add: 'edit-config',
    replace: 'edit-config',
    remove: 'remove-config'
  },
  typeFilter: function(doc, oldDoc) {
    // Example valid document IDs: "wepay-registration-confirmation.en.first-payment", "wepay-registration-confirmation.fr.follow-up"
    return /^wepay-registration-confirmation\.[a-z]{2}\.[A-Za-z0-9_-]+$/.test(doc._id);
  },
  propertyValidators: {
    subject: {
      type: 'string'
    },
    message: {
      type: 'string'
    },
    action: {
      type: 'string'
    }
  }
}
