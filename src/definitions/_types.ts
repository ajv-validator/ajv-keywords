import {KeywordDefinition} from "ajv"

export interface DefinitionOptions {
  defaultMeta?: string
}

export type GetDefinition = (opts?: DefinitionOptions) => KeywordDefinition
