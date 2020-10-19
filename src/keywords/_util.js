"use strict"

module.exports = {
  metaSchemaRef: metaSchemaRef,
}

const META_SCHEMA_ID = "http://json-schema.org/draft-07/schema"

function metaSchemaRef(ajv) {
  const {defaultMeta} = ajv.opts
  if (typeof defaultMeta == "string") return {$ref: defaultMeta}
  if (ajv.getSchema(META_SCHEMA_ID)) return {$ref: META_SCHEMA_ID}
  ajv.logger.warn("meta schema not defined")
  return {}
}
