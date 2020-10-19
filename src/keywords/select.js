"use strict"

const util = require("./_util")

module.exports = function defFunc(ajv) {
  if (!ajv.opts.$data) {
    ajv.logger.warn("keyword select requires $data option")
    return ajv
  }
  const metaSchemaRef = util.metaSchemaRef(ajv)
  const compiledCaseSchemas = []

  defFunc.definition = {
    validate: function v(schema, data, parentSchema) {
      if (parentSchema.selectCases === undefined) throw new Error('keyword "selectCases" is absent')
      const compiled = getCompiledSchemas(parentSchema, false)
      let validate = compiled.cases[schema]
      if (validate === undefined) validate = compiled.default
      if (typeof validate == "boolean") return validate
      const valid = validate(data)
      if (!valid) v.errors = validate.errors
      return valid
    },
    $data: true,
    metaSchema: {type: ["string", "number", "boolean", "null"]},
  }

  ajv.addKeyword("select", defFunc.definition)
  ajv.addKeyword("selectCases", {
    compile: function (schemas, parentSchema) {
      const compiled = getCompiledSchemas(parentSchema)
      for (const value in schemas) compiled.cases[value] = compileOrBoolean(schemas[value])
      return function () {
        return true
      }
    },
    valid: true,
    metaSchema: {
      type: "object",
      additionalProperties: metaSchemaRef,
    },
  })
  ajv.addKeyword("selectDefault", {
    compile: function (schema, parentSchema) {
      const compiled = getCompiledSchemas(parentSchema)
      compiled.default = compileOrBoolean(schema)
      return function () {
        return true
      }
    },
    valid: true,
    metaSchema: metaSchemaRef,
  })
  return ajv

  function getCompiledSchemas(parentSchema, create) {
    let compiled
    compiledCaseSchemas.some((c) => {
      if (c.parentSchema === parentSchema) {
        compiled = c
        return true
      }
    })
    if (!compiled && create !== false) {
      compiled = {
        parentSchema: parentSchema,
        cases: {},
        default: true,
      }
      compiledCaseSchemas.push(compiled)
    }
    return compiled
  }

  function compileOrBoolean(schema) {
    return typeof schema == "boolean" ? schema : ajv.compile(schema)
  }
}
