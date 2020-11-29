import ajvKeywordsPlugin from "../dist"
import ajvPack from "./ajv_pack"
const jsonSchemaTest = require("json-schema-test")
const options = {
  $data: true,
  strictTuples: false,
  allowUnionTypes: true,
}

jsonSchemaTest(ajvKeywordsPlugin(ajvPack(options)), {
  description: `json test suite with standalone code`,
  suites: {
    tests: "./tests/{**/,}*.json",
  },
  only: [
    // "uniqueItemProperties",
    "allRequired",
    "anyRequired",
    "oneRequired",
    "patternRequired",
    "prohibited",
    "deepProperties",
    "deepRequired",
    "select",
  ],
  cwd: __dirname,
  hideFolder: "tests/",
})
