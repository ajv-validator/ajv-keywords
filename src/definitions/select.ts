import type {KeywordDefinition, KeywordErrorDefinition, KeywordCxt} from "ajv"
import {_, nil} from "ajv/dist/compile/codegen"
import {applySubschema} from "ajv/dist/compile/subschema"
import type {DefinitionOptions} from "./_types"
import {metaSchemaRef} from "./_util"

const error: KeywordErrorDefinition = {
  message: "should be equal to one of the allowed values",
  params: ({schemaCode}) => _`{allowedValues: ${schemaCode}}`,
}

export default function getDef(opts?: DefinitionOptions): KeywordDefinition[] {
  const metaSchema = metaSchemaRef(opts)

  return [
    {
      keyword: "select",
      schemaType: ["string", "number", "boolean", "null"],
      $data: true,
      error,
      dependencies: ["selectCases"],
      code(cxt: KeywordCxt) {
        const {gen, schemaCode, parentSchema, it} = cxt
        cxt.block$data(nil, () => {
          const valid = gen.let("valid", true)
          const schValid = gen.name("_valid")
          const value = gen.const("value", _`${schemaCode} === null ? "null" : ${schemaCode}`)
          gen.if(false)
          for (const schemaProp in parentSchema.selectCases) {
            gen.elseIf(_`${value} == ${schemaProp}`) // intentional ==, to match numbers and booleans
            applySubschema(it, {keyword: "selectCases", schemaProp}, schValid)
            gen.assign(valid, schValid)
          }
          gen.else()
          if (parentSchema.selectDefault) {
            applySubschema(it, {keyword: "selectDefault"}, schValid)
          } else {
            gen.assign(valid, true)
          }
          gen.endIf()
          cxt.pass(valid)
        })
      },
    },
    {
      keyword: "selectCases",
      dependencies: ["select"],
      metaSchema: {
        type: "object",
        additionalProperties: metaSchema,
      },
    },
    {
      keyword: "selectDefault",
      dependencies: ["select", "selectCases"],
      metaSchema,
    },
  ]
}

// function checkSelect({keyword, parentSchema, it: {opts, self}}: KeywordCxt): void {
//   if (parentSchema.select !== undefined || !opts.strict) return
//   const msg = `strict mode: "${keyword}" without "select" is ignored`
//   if (opts.strict === true) throw new Error(msg)
//   self.logger.warn(msg)
// }

// module.exports = function defFunc(ajv) {
//   const compiledCaseSchemas = []

//   defFunc.definition = {
//     validate: function v(schema, data, parentSchema) {
//       if (parentSchema.selectCases === undefined) throw new Error('keyword "selectCases" is absent')
//       const compiled = getCompiledSchemas(parentSchema, false)
//       let validate = compiled.cases[schema]
//       if (validate === undefined) validate = compiled.default
//       if (typeof validate == "boolean") return validate
//       const valid = validate(data)
//       if (!valid) v.errors = validate.errors
//       return valid
//     },
//     $data: true,
//     metaSchema: {type: ["string", "number", "boolean", "null"]},
//   }

//   ajv.addKeyword("select", defFunc.definition)
//   ajv.addKeyword("selectCases", {
//     compile: function (schemas, parentSchema) {
//       const compiled = getCompiledSchemas(parentSchema)
//       for (const value in schemas) compiled.cases[value] = compileOrBoolean(schemas[value])
//       return function () {
//         return true
//       }
//     },
//     valid: true,
//     metaSchema: {
//       type: "object",
//       additionalProperties: metaSchemaRef,
//     },
//   })
//   ajv.addKeyword("selectDefault", {
//     compile: function (schema, parentSchema) {
//       const compiled = getCompiledSchemas(parentSchema)
//       compiled.default = compileOrBoolean(schema)
//       return function () {
//         return true
//       }
//     },
//     valid: true,
//     metaSchema: metaSchemaRef,
//   })
//   return ajv

//   function getCompiledSchemas(parentSchema, create) {
//     let compiled
//     compiledCaseSchemas.some((c) => {
//       if (c.parentSchema === parentSchema) {
//         compiled = c
//         return true
//       }
//     })
//     if (!compiled && create !== false) {
//       compiled = {
//         parentSchema: parentSchema,
//         cases: {},
//         default: true,
//       }
//       compiledCaseSchemas.push(compiled)
//     }
//     return compiled
//   }

//   function compileOrBoolean(schema) {
//     return typeof schema == "boolean" ? schema : ajv.compile(schema)
//   }
// }
