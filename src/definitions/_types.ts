import {KeywordDefinition} from "ajv"

export interface DefinitionOptions {
  defaultMeta?: string | boolean
}

export type GetDefinition = (opts?: DefinitionOptions) => KeywordDefinition
