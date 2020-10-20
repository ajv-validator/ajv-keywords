import {MacroKeywordDefinition} from "ajv"

const def: MacroKeywordDefinition = {
  keyword: "prohibited",
  type: "object",
  schemaType: "array",
  macro: function (schema: string[]) {
    if (schema.length === 0) return true
    if (schema.length === 1) return {not: {required: schema}}
    return {not: {anyOf: schema.map((p) => ({required: [p]}))}}
  },
  metaSchema: {
    type: "array",
    items: {type: "string"},
  },
}

export default def
module.exports = def
