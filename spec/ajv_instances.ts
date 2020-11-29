import Ajv from "ajv"
import type {Plugin, Options, KeywordDefinition} from "ajv"
import type {GetDefinition} from "../dist/definitions/_types"
import ajvKeywordsPlugin from "../dist"
import ajvKeywords from "../dist/definitions"

type GetDef = GetDefinition<KeywordDefinition>

export default function getAjvInstances(
  keyword: string | string[],
  kwdDef: GetDef | GetDef[],
  kwdPlugin: Plugin<any>,
  opts?: Options
): Ajv[] {
  return [
    kwdPlugin(new Ajv(opts)),
    new Ajv({...opts, keywords: Array.isArray(kwdDef) ? kwdDef.map((d) => d()) : [kwdDef()]}),
    ajvKeywordsPlugin(new Ajv(opts), keyword),
    ajvKeywordsPlugin(new Ajv(opts)),
    new Ajv({...opts, keywords: ajvKeywords()}),
    new Ajv(opts).addVocabulary(ajvKeywords()),
  ]
}
