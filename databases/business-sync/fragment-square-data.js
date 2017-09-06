{
  channels: function(doc, oldDoc) {
    var regex = /^merchant\.([A-Za-z0-9_-]+)(?:\..+)?$/;
    var matchGroups = regex.exec(doc._id);
    var merchantId = matchGroups ? matchGroups[1] : null;
    return { write: [ merchantId, staffChannel ]};
  },
  typeFilter: function(doc, oldDoc) {
    return /^merchant\.[A-Za-z0-9_-]+\.biz\.[0-9]+\.\b(fee|item|payment|refund|settlement)\b\.[A-Za-z0-9_-]+$/.test(doc._id);
  },
  propertyValidators: {
    id: {
      type: 'string',
      required: true,
      mustNotBeEmpty: true
    },
    kashooId: {
      type: 'integer',
      minimumValue: 1
    },
    entity: {
      type: 'object',
      required: true,
      allowUnknownProperties: true
    }
  }
}
