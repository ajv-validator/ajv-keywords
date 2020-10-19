"use strict"

const Ajv = require("ajv")
const jsonSchemaTest = require("json-schema-test")
const defineKeywords = require("../dist")

const ajvs = [
  defineKeywords(getAjv(), [
    "allRequired",
    "anyRequired",
    "oneRequired",
    "deepProperties",
    "deepRequired",
    "formatMaximum",
    "formatMinimum",
    "patternRequired",
    "prohibited",
    "select",
    "switch",
    "uniqueItemProperties",
  ]),
  defineKeywords(getAjv()),
  defineKeywords(getAjv(true)),
  defineKeywords(getAjvNoMeta()),
]

jsonSchemaTest(ajvs, {
  description: "json test suite",
  suites: {
    tests: "./tests/{**/,}*.json",
  },
  // afterError: after.error,
  // afterEach: after.each,
  cwd: __dirname,
  hideFolder: "tests/",
})

function getAjv(extras) {
  return new Ajv({
    $data: true,
    allErrors: extras,
    verbose: extras,
    unknownFormats: ["allowedUnknown"],
  })
}

function getAjvNoMeta() {
  return new Ajv({
    $data: true,
    unknownFormats: ["allowedUnknown"],
    meta: false,
    validateSchema: false,
  })
}
