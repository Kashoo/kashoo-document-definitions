function() {
  // Regex for feature toggle names that's shared between a couple of fragments.
  var featureToggleNameRegex = /^[a-z0-9_-]+$/;

  return {
    announcements: importDocumentDefinitionFragment('fragment-announcements.js'),
    avalaraCanadianTaxes: importDocumentDefinitionFragment('fragment-avalara-canadian-taxes.js'),
    featureReleaseToggleDefinitions: importDocumentDefinitionFragment('fragment-feature-release-toggle-definitions.js'),
    featureReleaseToggles: importDocumentDefinitionFragment('fragment-feature-release-toggles.js'),
    paymentNotificationTemplates: importDocumentDefinitionFragment('fragment-payment-notification-templates.js'),
    paymentProcessingFeeTemplate: importDocumentDefinitionFragment('fragment-payment-processing-fee-template.js'),
    settlementNotificationTemplates: importDocumentDefinitionFragment('fragment-settlement-notification-templates.js'),
    wepayRegistrationConfirmationTemplate: importDocumentDefinitionFragment('fragment-wepay-registration-confirmation-template.js')
  };
}
