import {FuncKeywordDefinition, AnySchemaObject} from "ajv"

type TransformName =
  | "trimStart"
  | "trimEnd"
  | "trimLeft"
  | "trimRight"
  | "trim"
  | "toLowerCase"
  | "toUpperCase"
  | "toEnumCase"

interface TransformConfig {
  hash: Record<string, string | undefined>
}

type Transform = (s: string, cfg?: TransformConfig) => string

const transform: {[key in TransformName]: Transform} = {
  trimStart: (s) => s.trimStart(),
  trimEnd: (s) => s.trimEnd(),
  trimLeft: (s) => s.trimStart(),
  trimRight: (s) => s.trimEnd(),
  trim: (s) => s.trim(),
  toLowerCase: (s) => s.toLowerCase(),
  toUpperCase: (s) => s.toUpperCase(),
  toEnumCase: (s, cfg) => cfg?.hash[configKey(s)] || s,
}

const def: FuncKeywordDefinition = {
  keyword: "transform",
  type: "string",
  schemaType: "array",
  errors: false,
  modifying: true,
  // valid: true, // TODO fix in ajv: this option does not work with code optimization
  compile(schema: TransformName[], parentSchema) {
    let cfg: TransformConfig
    if (schema.includes("toEnumCase")) cfg = getEnumCaseCfg(parentSchema)

    return function (data, dataCxt): boolean {
      // skip if top level value
      if (!dataCxt) return true
      const {parentData, parentDataProperty: key} = dataCxt
      if (!parentData) return true // TODO fix in ajv: either dataCxt type should be changed or undefined context should be passed when parentData is undefined
      // apply transforms in order provided
      for (const t of schema) data = transform[t](data, cfg)
      parentData[key as keyof typeof parentData] = data
      return true
    }
  },
  metaSchema: {
    type: "array",
    items: {type: "string", enum: Object.keys(transform)},
  },
}

function getEnumCaseCfg(parentSchema: AnySchemaObject): TransformConfig {
  // build hash table to enum values
  const cfg: TransformConfig = {hash: {}}

  // requires `enum` in the same schema as transform
  if (!parentSchema.enum) {
    throw new Error('Missing enum. To use `transform:["toEnumCase"]`, `enum:[...]` is required.')
  }
  for (const v of parentSchema.enum) {
    if (typeof v !== "string") continue
    const k = configKey(v)
    // requires all `enum` values have unique keys
    if (cfg.hash[k]) {
      throw new Error(
        'Invalid enum uniqueness. To use `transform:["toEnumCase"]`, all values must be unique when case insensitive.'
      )
    }
    cfg.hash[k] = v
  }

  return cfg
}

function configKey(s: string): string {
  return s.toLowerCase()
}

export default def
module.exports = def
