{
  channels: {
    view: 'view-config',
    add: 'edit-config',
    replace: 'edit-config',
    remove: 'remove-config'
  },
  typeFilter: function(doc, oldDoc) {
    // Example valid document IDs: "payment-processing-fee.en.invoice-number", "payment-processing-fee.fr.invoice-id"
    return /^payment-processing-fee\.[a-z]{2}\.[A-Za-z0-9_-]+$/.test(doc._id);
  },
  propertyValidators: {
    lineItemNote: {
      type: 'string',
      required: true,
      mustNotBeEmpty: true
    }
  }
}
