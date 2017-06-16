{
  channels: getDocSyncChannels(doc, oldDoc, 'NOTIFICATIONS_CONFIG'),
  typeFilter: function(doc, oldDoc) {
    return createBusinessEntityRegex('notificationTransport\\.[A-Za-z0-9_-]+').test(doc._id);
  },
  propertyValidators: {
    type: {
      // The type of notification transport (e.g. email, sms). Used by a notification service to determine how to deliver a
      // notification.
      type: 'string',
      required: true,
      mustNotBeEmpty: true
    },
    recipient: {
      // The intended recipient for notifications that are configured to use this transport
      type: 'string',
      required: true,
      mustNotBeEmpty: true
    }
  }
}
