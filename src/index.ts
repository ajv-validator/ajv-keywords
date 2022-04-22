/* eslint-disable valid-jsdoc */ // this rule is deprecated and insists on adding type annotations that already exist in TypeScript
import type Ajv from "ajv"
import type {Plugin} from "ajv"
import type {DefinitionOptions} from "./definitions/_types"
import keywords from "./keywords"

export {AjvKeywordsError} from "./definitions"

/**
 * @param ajv instance
 * @param specificKeywords only these keywords to-be-added
 * @param options modifications passed to keywords
 * @returns ajv instance
 */
const ajvKeywords: Plugin<string | string[]> = (
  ajv: Ajv,
  specificKeywords?: string | string[],
  options: DefinitionOptions = {}
): Ajv => {
  if (Array.isArray(specificKeywords)) {
    for (const k of specificKeywords) addKeyword(ajv, k, options)
    return ajv
  }
  if (specificKeywords) {
    addKeyword(ajv, specificKeywords, options)
    return ajv
  }

  for (const keyword in keywords) addKeyword(ajv, keyword, options)
  return ajv
}

ajvKeywords.get = get

function get(keyword: string): Plugin<any> {
  const defFunc = keywords[keyword]
  if (!defFunc) throw new Error("Unknown keyword " + keyword)
  return defFunc
}

function addKeyword(ajv: Ajv, keyword: string, options: DefinitionOptions): void {
  const defFunc = get(keyword)
  defFunc(ajv, options)
}

export default ajvKeywords
module.exports = ajvKeywords

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
module.exports.default = ajvKeywords
