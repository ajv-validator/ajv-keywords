import {CodeKeywordDefinition, KeywordCxt, JSONSchemaType} from "ajv"
import {_, Name} from "ajv/dist/compile/codegen"

interface RegexpSchema {
  pattern: string
  flags?: string
}

const regexpMetaSchema: JSONSchemaType<RegexpSchema> = {
  type: "object",
  properties: {
    pattern: {type: "string"},
    flags: {type: "string", nullable: true},
  },
  required: ["pattern"],
  additionalProperties: false,
}

const metaRegexp = /^\/(.*)\/([gimuy]*)$/

const def: CodeKeywordDefinition = {
  keyword: "regexp",
  type: "string",
  schemaType: ["string", "object"],
  code(cxt: KeywordCxt) {
    const {gen, data, schema, it} = cxt
    const regx = getRegExp(schema)
    cxt.pass(_`${regx}.test(${data})`)

    function getRegExp(sch: string | RegexpSchema): Name {
      if (typeof sch == "object") return usePattern(sch.pattern, sch.flags)
      const rx = metaRegexp.exec(sch)
      if (rx) return usePattern(rx[1], rx[2])
      throw new Error("cannot parse string into RegExp")
    }

    function usePattern(pattern: string, flags?: string): Name {
      try {
        return gen.scopeValue("pattern", {
          key: pattern,
          ref: new RegExp(pattern, flags),
          code: _`new RegExp(${pattern}, ${flags})`,
        })
      } catch (e) {
        it.self.logger.error("regular expression", pattern, flags, "is invalid")
        throw e
      }
    }
  },
  metaSchema: {
    anyOf: [{type: "string"}, regexpMetaSchema],
  },
}

export default def
module.exports = def
