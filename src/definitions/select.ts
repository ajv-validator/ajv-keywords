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
          if (parentSchema.selectDefault !== undefined) {
            applySubschema(it, {keyword: "selectDefault"}, schValid)
            gen.assign(valid, schValid)
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
