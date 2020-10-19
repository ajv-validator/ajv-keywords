"use strict"

const util = require("./_util")

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: "object",
    macro: function (schema) {
      const schemas = []
      for (const pointer in schema) schemas.push(getSchema(pointer, schema[pointer]))
      return {allOf: schemas}
    },
    metaSchema: {
      type: "object",
      propertyNames: {
        type: "string",
        format: "json-pointer",
      },
      additionalProperties: util.metaSchemaRef(ajv),
    },
  }

  ajv.addKeyword("deepProperties", defFunc.definition)
  return ajv
}

function getSchema(jsonPointer, schema) {
  const segments = jsonPointer.split("/")
  const rootSchema = {}
  let pointerSchema = rootSchema
  for (let i = 1; i < segments.length; i++) {
    let segment = segments[i]
    const isLast = i === segments.length - 1
    segment = unescapeJsonPointer(segment)
    const properties = (pointerSchema.properties = {})
    let items
    if (/[0-9]+/.test(segment)) {
      let count = +segment
      items = pointerSchema.items = []
      while (count--) items.push({})
    }
    pointerSchema = isLast ? schema : {}
    properties[segment] = pointerSchema
    if (items) items.push(pointerSchema)
  }
  return rootSchema
}

function unescapeJsonPointer(str) {
  return str.replace(/~1/g, "/").replace(/~0/g, "~")
}
