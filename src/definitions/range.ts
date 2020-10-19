import {MacroKeywordDefinition} from "ajv"

const def: MacroKeywordDefinition = {
  keyword: "range",
  type: "number",
  schemaType: "array",
  macro: function ([min, max], {exclusiveRange}) {
    validateRangeSchema(min, max, exclusiveRange)
    return exclusiveRange === true
      ? {exclusiveMinimum: min, exclusiveMaximum: max}
      : {minimum: min, maximum: max}
  },
  metaSchema: {
    type: "array",
    minItems: 2,
    maxItems: 2,
    items: {type: "number"},
  },
}

function validateRangeSchema(min: number, max: number, exclusive?: boolean): void {
  if (exclusive !== undefined && typeof exclusive != "boolean") {
    throw new Error("Invalid schema for exclusiveRange keyword, should be boolean")
  }

  if (min > max || (exclusive && min === max)) throw new Error("There are no numbers in range")
}

export default def
module.exports = def
