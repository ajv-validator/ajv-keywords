"use strict"

const SCALAR_TYPES = ["number", "integer", "string", "boolean", "null"]

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: "array",
    compile: function (keys, parentSchema, it) {
      const {equal} = it.util
      const scalar = getScalarKeys(keys, parentSchema)

      return function (data) {
        if (data.length > 1) {
          for (let k = 0; k < keys.length; k++) {
            const key = keys[k]
            if (scalar[k]) {
              const hash = {}
              for (let i = data.length; i--; ) {
                if (!data[i] || typeof data[i] != "object") continue
                let prop = data[i][key]
                if (prop && typeof prop == "object") continue
                if (typeof prop == "string") prop = '"' + prop
                if (hash[prop]) return false
                hash[prop] = true
              }
            } else {
              for (let i = data.length; i--; ) {
                if (!data[i] || typeof data[i] != "object") continue
                for (let j = i; j--; ) {
                  if (data[j] && typeof data[j] == "object" && equal(data[i][key], data[j][key])) {
                    return false
                  }
                }
              }
            }
          }
        }
        return true
      }
    },
    metaSchema: {
      type: "array",
      items: {type: "string"},
    },
  }

  ajv.addKeyword("uniqueItemProperties", defFunc.definition)
  return ajv
}

function getScalarKeys(keys, schema) {
  return keys.map((key) => {
    const properties = schema.items && schema.items.properties
    const propType = properties && properties[key] && properties[key].type
    return Array.isArray(propType)
      ? propType.indexOf("object") < 0 && propType.indexOf("array") < 0
      : SCALAR_TYPES.indexOf(propType) >= 0
  })
}
