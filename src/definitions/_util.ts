import type {DefinitionOptions} from "./_types"
import type {SchemaObject} from "ajv"

const META_SCHEMA_ID = "http://json-schema.org/draft-07/schema"

export function metaSchemaRef({defaultMeta}: DefinitionOptions = {}): SchemaObject {
  return defaultMeta === false ? {} : {$ref: defaultMeta || META_SCHEMA_ID}
}
