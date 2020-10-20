import {MacroKeywordDefinition} from "ajv"

const def: MacroKeywordDefinition = {
  keyword: "anyRequired",
  type: "object",
  schemaType: "array",
  macro(schema: string[]) {
    if (schema.length === 0) return true
    if (schema.length === 1) return {required: schema}
    return {anyOf: schema.map((p) => ({required: [p]}))}
  },
  metaSchema: {
    type: "array",
    items: {type: "string"},
  },
}

export default def
module.exports = def
