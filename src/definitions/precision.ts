import {CodeKeywordDefinition, KeywordCxt} from "ajv"
import {_, str} from "ajv/dist/compile/codegen"

export default function getDef(): CodeKeywordDefinition {
  return {
    keyword: "precision",
    type: "number",
    metaSchema: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    code(cxt: KeywordCxt) {
      const {data, schema} = cxt

      cxt.fail(_`parseFloat(Number(${data}).toFixed(${schema})) !== ${data}`)
    },
    error: {
      message: ({schema}) => str`must have maximum precision of ${schema} digits`,
      params: ({schemaCode}) => _`{ precision: ${schemaCode} }`,
    },
  }
}
