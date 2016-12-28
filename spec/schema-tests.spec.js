'use strict';

var Ajv = require('ajv');
var jsonSchemaTest = require('json-schema-test');
var defineKeywords = require('..');

var ajvs = [
  // defineKeywords(getAjv(),
  //   ['switch', 'patternRequired', 'formatMinimum', 'formatMaximum']),
  defineKeywords(getAjv(), ['if', 'prohibited', 'deepRequired', 'deepProperties']),
  defineKeywords(getAjv()),
  defineKeywords(getAjv(true))
];


jsonSchemaTest(ajvs, {
  description: 'json test suite',
  suites: {
    'tests': './tests/{**/,}*.json'
  },
  // afterError: after.error,
  // afterEach: after.each,
  cwd: __dirname,
  hideFolder: 'tests/'
});


function getAjv(extras) {
  return new Ajv({
    v5: true,
    allErrors: extras,
    verbose: extras,
    unknownFormats: ['allowedUnknown']
  });
}
