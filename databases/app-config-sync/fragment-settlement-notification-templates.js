{
  channels: {
    view: 'view-config',
    add: 'edit-config',
    replace: 'edit-config',
    remove: 'remove-config'
  },
  typeFilter: function(doc, oldDoc) {
    return /^settlement-notifications\.[a-z]{2}\.messages$/.test(doc._id);
  },
  propertyValidators: {
    editPaymentProcessorConfigActionLabel: {
      type: 'string',
      mustNotBeEmpty: true
    },
    editLockedPeriodActionLabel: {
      type: 'string',
      mustNotBeEmpty: true
    },
    settlementProcessingFailedSubject: {
      type: 'string',
      mustNotBeEmpty: true
    },
    settlementProcessingFailedBody: {
      type: 'string',
      mustNotBeEmpty: true
    },
    removedAccountTemplate: {
      type: 'string',
      mustNotBeEmpty: true
    },
    lockedPeriodFailureBodyTemplate: {
      type: 'string',
      mustNotBeEmpty: true
    }
  }
}
