import type {DefinitionOptions} from "./_types"
import type {SchemaObject, CodeGen, Name} from "ajv"
import {_} from "ajv/dist/compile/codegen"

const META_SCHEMA_ID = "http://json-schema.org/schema"

export function metaSchemaRef({defaultMeta}: DefinitionOptions = {}): SchemaObject {
  return defaultMeta === false ? {} : {$ref: defaultMeta || META_SCHEMA_ID}
}

export function usePattern(gen: CodeGen, pattern: string, flags = "u"): Name {
  return gen.scopeValue("pattern", {
    key: pattern,
    ref: new RegExp(pattern, flags),
    code: _`new RegExp(${pattern}, ${flags})`,
  })
}
