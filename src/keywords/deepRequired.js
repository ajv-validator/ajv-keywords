"use strict"

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: "object",
    inline: function (it, keyword, schema) {
      let expr = ""
      for (let i = 0; i < schema.length; i++) {
        if (i) expr += " && "
        expr += "(" + getData(schema[i], it.dataLevel) + " !== undefined)"
      }
      return expr
    },
    metaSchema: {
      type: "array",
      items: {
        type: "string",
        format: "json-pointer",
      },
    },
  }

  ajv.addKeyword("deepRequired", defFunc.definition)
  return ajv
}

function getData(jsonPointer, lvl) {
  let data = "data" + (lvl || "")
  if (!jsonPointer) return data

  let expr = data
  const segments = jsonPointer.split("/")
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i]
    data += getProperty(unescapeJsonPointer(segment))
    expr += " && " + data
  }
  return expr
}

const IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i
const INTEGER = /^[0-9]+$/
const SINGLE_QUOTE = /'|\\/g
function getProperty(key) {
  return INTEGER.test(key)
    ? "[" + key + "]"
    : IDENTIFIER.test(key)
    ? "." + key
    : "['" + key.replace(SINGLE_QUOTE, "\\$&") + "']"
}

function unescapeJsonPointer(str) {
  return str.replace(/~1/g, "/").replace(/~0/g, "~")
}
