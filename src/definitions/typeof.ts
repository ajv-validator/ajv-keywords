import {CodeKeywordDefinition, KeywordCxt} from "ajv"
import {_} from "ajv/dist/compile/codegen"

const TYPES = ["undefined", "string", "number", "object", "function", "boolean", "symbol"]

const def: CodeKeywordDefinition = {
  keyword: "typeof",
  schemaType: ["string", "array"],
  code(cxt: KeywordCxt) {
    const {data, schema, schemaValue} = cxt
    cxt.fail(
      typeof schema == "string"
        ? _`typeof ${data} != ${schema}`
        : _`${schemaValue}.indexOf(typeof ${data}) < 0`
    )
  },
  metaSchema: {
    anyOf: [
      {type: "string", enum: TYPES},
      {type: "array", items: {type: "string", enum: TYPES}},
    ],
  },
}

export default def
module.exports = def
