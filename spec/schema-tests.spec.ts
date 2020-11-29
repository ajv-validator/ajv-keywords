import Ajv from "ajv/dist/2019"
import type {Vocabulary} from "ajv"
import ajvKeywordsPlugin from "../dist"
import ajvKeywords from "../dist/definitions"
const jsonSchemaTest = require("json-schema-test")

const ajvs = [
  ajvKeywordsPlugin(getAjv(), [
    "uniqueItemProperties",
    "allRequired",
    "anyRequired",
    "oneRequired",
    "patternRequired",
    "prohibited",
    "deepProperties",
    "deepRequired",
    "select",
  ]),
  ajvKeywordsPlugin(getAjv()),
  ajvKeywordsPlugin(getAjv(true)),
  getAjv(undefined, ajvKeywords()),
  getAjv(true, ajvKeywords()),
  // ajvKeywordsPlugin(getAjvNoMeta()),
  getAjvNoMeta(ajvKeywords({defaultMeta: false})),
]

jsonSchemaTest(ajvs, {
  description: `json test suite with ${ajvs.length} ajv instances`,
  suites: {
    tests: "./tests/{**/,}*.json",
  },
  only: [],
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
    strictTypes: false,
    strictTuples: false,
  })
}

function getAjvNoMeta(keywords?: Vocabulary): Ajv {
  return new Ajv({
    $data: true,
    keywords,
    formats: {allowedUnknown: true},
    meta: false,
    validateSchema: false,
    strictTypes: false,
    strictTuples: false,
  })
}
