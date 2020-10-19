import {CodeKeywordDefinition, KeywordCxt, _} from "ajv"

const def: CodeKeywordDefinition = {
  keyword: "typeof",
  schemaType: ["string", "array"],
  code(cxt: KeywordCxt) {
    const {data, schema, schemaValue} = cxt
    if (typeof schema == "string") {
      cxt.fail(_`typeof ${data} != ${schema}`)
    } else {
      cxt.fail(_`${schemaValue}.indexOf(typeof ${data}) < 0`)
    }
  },
  metaSchema: {
    anyOf: [
      {type: "string", enum: KNOWN_TYPES},
      {type: "array", items: {type: "string", enum: KNOWN_TYPES}},
    ],
  },
}

export default def
module.exports = def
