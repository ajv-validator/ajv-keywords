'use strict';

var Ajv = require('ajv');
var jsonSchemaTest = require('json-schema-test');
var defineKeywords = require('..');

var ajvs = [
  defineKeywords(getAjv(),
    ['switch', 'patternRequired', 'formatMinimum', 'formatMaximum']),
  defineKeywords(getAjv())
];


jsonSchemaTest(ajvs, {
  description: 'keywords "switch", "patternRequired", "formatMinimum", "formatMaximum"',
  suites: {
    'tests': './tests/{**/,}*.json'
  },
  // afterError: after.error,
  // afterEach: after.each,
  cwd: __dirname,
  hideFolder: 'tests/'
});


function getAjv() {
  return new Ajv({ v5: true, unknownFormats: ['allowedUnknown'] });
}
