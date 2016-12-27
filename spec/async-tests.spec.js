'use strict';

var Ajv = require('ajv');
var jsonSchemaTest = require('json-schema-test');
var defineKeywords = require('..');

var ajvs = [
  defineKeywords(getAjv(), 'switch'),
  defineKeywords(getAjv()),
  defineKeywords(getAjv(true))
];


jsonSchemaTest(ajvs, {
  description: 'keywords "switch" with async schemas',
  suites: {
    'tests': './async-tests/{**/,}*.json'
  },
  async: true,
  asyncValid: 'data',
  // afterError: after.error,
  // afterEach: after.each,
  cwd: __dirname,
  hideFolder: 'async-tests/'
});


function getAjv(extras) {
  var ajv = new Ajv({ allErrors: extras, verbose: extras });
  ajv.addKeyword('idExists', {
    async: true,
    type: 'number',
    validate: checkIdExists,
    errors: false
  });
  return ajv;
}


function checkIdExists(schema, data) {
  switch (schema.table) {
    case 'users': return check([1, 5, 8]);
    case 'posts': return check([21, 25, 28]);
    default: throw new Error('no such table');
  }

  function check(IDs) {
    return Promise.resolve(IDs.indexOf(data) >= 0);
  }
}
