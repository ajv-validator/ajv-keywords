import {MacroKeywordDefinition} from "ajv"

const def: MacroKeywordDefinition = {
  keyword: "allRequired",
  type: "object",
  schemaType: "boolean",
  macro(schema: string[], parentSchema) {
    if (!schema) return true
    const required = Object.keys(parentSchema.properties)
    if (required.length === 0) return true
    return {required}
  },
  dependencies: ["properties"],
}

export default def
module.exports = def
