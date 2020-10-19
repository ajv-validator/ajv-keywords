import Ajv from "ajv"
import type {KeywordDefinition, Plugin, Options} from "ajv"
import ajvKeywordsPlugin from "../dist"
import ajvKeywords from "../dist/definitions"

export default function getAjvInstances(
  keyword: string | string[],
  kwdDef: KeywordDefinition | KeywordDefinition[],
  kwdPlugin: Plugin<any>,
  opts?: Options
): Ajv[] {
  return [
    kwdPlugin(new Ajv(opts)),
    new Ajv({...opts, keywords: Array.isArray(kwdDef) ? kwdDef : [kwdDef]}),
    ajvKeywordsPlugin(new Ajv(opts), keyword),
    // ajvKeywordsPlugin(new Ajv(opts)),
    new Ajv({...opts, keywords: ajvKeywords}),
    new Ajv(opts).addVocabulary(ajvKeywords),
  ]
}
