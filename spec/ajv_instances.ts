import Ajv from "ajv"
import type {Plugin, Options} from "ajv"
import type {GetDefinition} from "../dist/definitions/_types"
import ajvKeywordsPlugin from "../dist"
import ajvKeywords from "../dist/definitions"

export default function getAjvInstances(
  keyword: string | string[],
  kwdDef: GetDefinition | GetDefinition[],
  kwdPlugin: Plugin<any>,
  opts?: Options
): Ajv[] {
  return [
    kwdPlugin(new Ajv(opts)),
    new Ajv({...opts, keywords: Array.isArray(kwdDef) ? kwdDef.map((d) => d()) : [kwdDef()]}),
    ajvKeywordsPlugin(new Ajv(opts), keyword),
    // ajvKeywordsPlugin(new Ajv(opts)),
    new Ajv({...opts, keywords: ajvKeywords()}),
    new Ajv(opts).addVocabulary(ajvKeywords()),
  ]
}
