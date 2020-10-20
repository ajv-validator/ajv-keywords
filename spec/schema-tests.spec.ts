import Ajv from "ajv"
import type {Vocabulary} from "ajv"
import ajvKeywordsPlugin from "../dist"
import ajvKeywords from "../dist/definitions"
const jsonSchemaTest = require("json-schema-test")

const ajvs = [
  ajvKeywordsPlugin(getAjv(), [
    "allRequired",
    "anyRequired",
    "oneRequired",
    "prohibited",
    // "deepProperties",
    // "deepRequired",
    // "formatMaximum",
    // "formatMinimum",
    // "patternRequired",
    // "select",
    // "switch",
    // "uniqueItemProperties",
  ]),
  // ajvKeywordsPlugin(getAjv()),
  // ajvKeywordsPlugin(getAjv(true)),
  getAjv(undefined, ajvKeywords()),
  getAjv(true, ajvKeywords()),
  // ajvKeywordsPlugin(getAjvNoMeta()),
  getAjvNoMeta(ajvKeywords()),
]

jsonSchemaTest(ajvs, {
  description: `json test suite with ${ajvs.length} ajv instances`,
  suites: {
    tests: "./tests/{**/,}*.json",
  },
  only: ["allRequired", "anyRequired", "oneRequired", "prohibited"],
  // afterError: after.error,
  // afterEach: after.each,
  cwd: __dirname,
  hideFolder: "tests/",
})

function getAjv(extras?: boolean, keywords?: Vocabulary): Ajv {
  return new Ajv({
    $data: true,
    allErrors: extras,
    verbose: extras,
    keywords,
    formats: {allowedUnknown: true},
  })
}

function getAjvNoMeta(keywords?: Vocabulary): Ajv {
  return new Ajv({
    $data: true,
    keywords,
    formats: {allowedUnknown: true},
    meta: false,
    validateSchema: false,
  })
}
