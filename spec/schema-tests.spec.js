'use strict';

var Ajv = require('ajv');
var jsonSchemaTest = require('json-schema-test');
var defineKeywords = require('..');

var ajvs = [
  defineKeywords(getAjv(),
    ['switch', 'patternRequired', 'formatMinimum', 'formatMaximum',
     'if', 'prohibited', 'deepRequired', 'deepProperties']),
  defineKeywords(getAjv()),
  defineKeywords(getAjv(true)),
  defineKeywords(getAjvNoMeta()),
  defineKeywords(getAjvV5())
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
    $data: true,
    allErrors: extras,
    verbose: extras,
    unknownFormats: ['allowedUnknown']
  });
}


function getAjvNoMeta() {
  return new Ajv({
    $data: true,
    unknownFormats: ['allowedUnknown'],
    meta: false,
    validateSchema: false
  });
}


function getAjvV5() {
  var ajv = new Ajv({
    $data: true,
    meta: false,
    unknownFormats: 'ignore'
  });

  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));

  var metaSchema = require('ajv/lib/refs/json-schema-v5.json');
  ajv.addMetaSchema(metaSchema);
  ajv._opts.defaultMeta = metaSchema.id;

  ajv.removeKeyword('propertyNames');
  return ajv;
}
