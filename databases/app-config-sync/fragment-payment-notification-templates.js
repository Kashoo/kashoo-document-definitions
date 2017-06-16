{
  channels: {
    view: 'view-config',
    add: 'edit-config',
    replace: 'edit-config',
    remove: 'remove-config'
  },
  typeFilter: function(doc, oldDoc) {
    return /^payment-notifications\.[a-z]{2}\.messages$/.test(doc._id);
  },
  propertyValidators: {
    viewInvoiceActionLabel: {
      type: 'string',
      mustNotBeEmpty: true,
      required: true
    },
    editPaymentProcessorConfigActionLabel: {
      type: 'string',
      mustNotBeEmpty: true,
      required: true
    },
    editLockedPeriodActionLabel: {
      type: 'string',
      mustNotBeEmpty: true,
      required: true
    },
    paymentSuccessSubjectTemplate: {
      type: 'string',
      mustNotBeEmpty: true,
      required: true
    },
    paymentSuccessBodyTemplate: {
      type: 'string',
      mustNotBeEmpty: true,
      required: true
    },
    badConfigurationSubjectTemplate: {
      type: 'string',
      mustNotBeEmpty: true,
      required: true
    },
    missingProcessorBodyTemplate: {
      type: 'string',
      mustNotBeEmpty: true,
      required: true
    },
    processorAuthFailedBodyTemplate: {
      type: 'string',
      mustNotBeEmpty: true,
      required: true
    },
    lockedPeriodFailureBodyTemplate: {
      type: 'string',
      mustNotBeEmpty: true,
      required: true
    }
  }
}
