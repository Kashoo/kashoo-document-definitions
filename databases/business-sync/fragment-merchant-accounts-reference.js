{
  typeFilter: function(doc, oldDoc) {
    return createBusinessEntityRegex('merchantAccounts').test(doc._id);
  },
  channels: { write: staffChannel },
  propertyValidators: {
    // All of the Kashoo co-branded merchant accounts associated with the business
    accounts: {
      type: 'hashtable',
      hashtableKeysValidator: {
        mustNotBeEmpty: true
      },
      hashtableValuesValidator: {
        // Each entry references a merchant account that belongs to the business and the corresponding payment processor definition
        type: 'object',
        required: true,
        propertyValidators: {
          // The provider of the merchant account (e.g. "wepay")
          provider: {
            type: 'string',
            required: true,
            mustNotBeEmpty: true
          },
          // The unique ID of the merchant
          merchantAccountId: {
            type: 'string',
            required: true,
            mustNotBeEmpty: true
          },
          // The authorization/access token that can be used to access/manipulate the merchant account on behalf of the user
          authorization: {
            type: 'string',
            required: true,
            mustNotBeEmpty: true
          },
          // The ID of the Kashoo payment processor definition that is associated with this merchant account
          paymentProcessorDefinitionId: {
            type: 'string',
            required: true,
            mustNotBeEmpty: true
          },
          // The date/time that the account was confirmed/activated
          registrationConfirmed: {
            type: 'datetime',
            skipValidationWhenValueUnchangedStrict: true
          },
          // A list of the date/times that account registration confirmation requests were initiated
          registrationConfirmationRequisitions: {
            type: 'array',
            arrayElementsValidator: {
              type: 'datetime',
              skipValidationWhenValueUnchangedStrict: true,
              required: true
            }
          }
        }
      }
    }
  }
}
