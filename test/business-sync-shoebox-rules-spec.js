var businessSyncSpecHelperMaker = require('./helpers/business-sync-spec-helper-maker.js');
var synctos = require('synctos');
var testFixtureMaker = synctos.testFixtureMaker;
var errorFormatter = synctos.validationErrorFormatter;

describe('business-sync shoebox import rules document definition', function() {
  var testFixture, businessSyncSpecHelper;

  beforeEach(function() {
    testFixture = testFixtureMaker.initFromSyncFunction('build/sync-functions/business-sync/sync-function.js');
    businessSyncSpecHelper = businessSyncSpecHelperMaker.init(testFixture);
  });

  var expectedDocType = 'shoeboxImportRules';
  var expectedBasePrivilege = 'SHOEBOX_ITEMS';

  it('successfully creates a valid shoebox rules document', function() {
    var doc = {
      _id: 'biz.3.shoebox.importRules',
      rules: {
        ABC: {
          criteria: [
            {
              comparison: 'contains',
              field: 'description',
              value: 'this is garbage'
            }
          ],
          suggestions: [
            {
              suggestedField: 'accountNumber',
              suggestedValue: 2345
            },
            {
              suggestedField: 'taxIds',
              suggestedValue: [333, 555]
            }
          ],
          removed: false
        }
      }
    };

    businessSyncSpecHelper.verifyDocumentCreated(expectedBasePrivilege, 3, doc);
  });

  it('cannot create a shoebox import rules document when the properties are invalid', function() {
    var doc = {
      _id: 'biz.3.shoebox.importRules',
      rules: {
        ABC: {
          criteria: [
            {
              comparison: 'contains',
              field: 'description',
              value: 'this is actually not so bad'
            },
            {
              comparison: 'like',
              field: 'memo',
              value: ''
            }
          ],
          suggestions: [
            {
              suggestedField: 'vendor',
              suggestedValue: 2345
            },
            {
              suggestedField: 'taxIds',
              suggestedValue: [333, 555]
            }
          ],
        },
        '': {
          criteria: [ ],
          suggestions: [ ],
          removed: true
        }
      }
    };

    businessSyncSpecHelper.verifyDocumentNotCreated(
      expectedBasePrivilege,
      3,
      doc,
      expectedDocType,
      [
        errorFormatter.enumPredefinedValueViolation('rules[ABC].criteria[1].comparison', [ 'contains' ]),
        errorFormatter.enumPredefinedValueViolation('rules[ABC].criteria[1].field', [ 'description' ]),
        errorFormatter.mustNotBeEmptyViolation('rules[ABC].criteria[1].value'),
        errorFormatter.enumPredefinedValueViolation('rules[ABC].suggestions[0].suggestedField', [ 'accountNumber', 'taxIds' ]),
        errorFormatter.hashtableKeyEmpty("rules"),
        errorFormatter.mustNotBeEmptyViolation('rules[].criteria'),
        errorFormatter.mustNotBeEmptyViolation('rules[].suggestions'),
        errorFormatter.requiredValueViolation('rules[ABC].removed')
      ]);
  });

  it('can successfully replace a valid shoebox rules document', function() {
    var doc = {
      _id: 'biz.3.shoebox.importRules',
      rules: {
        ABC: {
          criteria: [
            {
              comparison: 'contains',
              field: 'description',
              value: 'this is garbage'
            }
          ],
          suggestions: [
            {
              suggestedField: 'taxIds',
              suggestedValue: [333, 555]
            }
          ],
          removed: false
        }
      }
    };
    var oldDoc = {
      _id: 'biz.3.shoebox.importRules',
      rules: {
        ABC: {
          criteria: [
            {
              comparison: 'contains',
              field: 'description',
              value: 'this is not so bad'
            }
          ],
          suggestions: [
            {
              suggestedField: 'accountNumber',
              suggestedValue: '1200'
            }
          ],
          removed: true
        }
      }
    };

    businessSyncSpecHelper.verifyDocumentReplaced(expectedBasePrivilege, 3, doc, oldDoc);
  });

  it('cannot replace a shoebox import rules document when the updated properties are invalid', function() {
    var doc = {
      _id: 'biz.3.shoebox.importRules',
      rules: {
        ABC: {
          criteria: [
            {
              comparison: 'contains',
              field: 'description',
              value: 'this is actually not so bad'
            },
            {
              comparison: 'like',
              field: 'memo',
              value: ''
            }
          ]
        }
      }
    };

    var oldDoc = {
      _id: 'biz.3.shoebox.importRules',
      rules: {
        ABC: {
          criteria: [
            {
              comparison: 'contains',
              field: 'description',
              value: 'this is not so bad'
            }
          ],
          suggestions: [
            {
              suggestedField: 'accountNumber',
              suggestedValue: '1200'
            }
          ],
          removed: true
        }
      }
    };

    businessSyncSpecHelper.verifyDocumentNotReplaced(
      expectedBasePrivilege,
      3,
      doc,
      oldDoc,
      expectedDocType,
      [
        errorFormatter.enumPredefinedValueViolation('rules[ABC].criteria[1].comparison', [ 'contains' ]),
        errorFormatter.enumPredefinedValueViolation('rules[ABC].criteria[1].field', [ 'description' ]),
        errorFormatter.mustNotBeEmptyViolation('rules[ABC].criteria[1].value'),
        errorFormatter.requiredValueViolation('rules[ABC].suggestions'),
        errorFormatter.requiredValueViolation('rules[ABC].removed')
      ]);
  });

  it('cannot delete a shoebox import rules document', function() {
    var oldDoc = {
      _id: 'biz.3.shoebox.importRules',
      rules: {
        ABC: {
          criteria: [
            {
              comparison: 'contains',
              field: 'description',
              value: 'this is garbage'
            }
          ],
          suggestions: [
            {
              suggestedField: 'taxIds',
              suggestedValue: [333, 555]
            }
          ],
          removed: false
        }
      }
    };

    businessSyncSpecHelper.verifyDocumentNotDeleted(expectedBasePrivilege, 3, oldDoc, expectedDocType, [ errorFormatter.cannotDeleteDocViolation() ]);
  });
});
