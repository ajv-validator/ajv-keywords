import {MacroKeywordDefinition} from "ajv"

type RangeKwd = "range" | "exclusiveRange"

export function getRangeDef(keyword: RangeKwd): MacroKeywordDefinition {
  return {
    keyword,
    type: "number",
    schemaType: "array",
    macro: function ([min, max]) {
      validateRangeSchema(min, max)
      return keyword === "range"
        ? {minimum: min, maximum: max}
        : {exclusiveMinimum: min, exclusiveMaximum: max}
    },
    metaSchema: {
      type: "array",
      minItems: 2,
      maxItems: 2,
      items: {type: "number"},
    },
  }

  function validateRangeSchema(min: number, max: number): void {
    if (min > max || (keyword === "exclusiveRange" && min === max)) {
      throw new Error("There are no numbers in range")
    }
  }
}
