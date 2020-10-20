import {MacroKeywordDefinition} from "ajv"

const def: MacroKeywordDefinition = {
  keyword: "oneRequired",
  type: "object",
  schemaType: "array",
  macro(schema: string[]) {
    if (schema.length === 0) return true
    if (schema.length === 1) return {required: schema}
    return {oneOf: schema.map((p) => ({required: [p]}))}
  },
  metaSchema: {
    type: "array",
    items: {type: "string"},
  },
}

export default def
module.exports = def
