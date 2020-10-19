import Ajv from "ajv"
import {Plugin} from "ajv"
import KEYWORDS from "./keywords"

const ajvKeywordsPlugin: Plugin<string | string[]> = (
  ajv: Ajv,
  keyword?: string | string[]
): Ajv => {
  if (Array.isArray(keyword)) {
    for (const k of keyword) get(k)(ajv)
    return ajv
  }
  if (keyword) {
    get(keyword)(ajv)
    return ajv
  }
  for (keyword in KEYWORDS) get(keyword)(ajv)
  return ajv
}

ajvKeywordsPlugin.get = get

function get(keyword: string): Plugin<any> {
  const defFunc = KEYWORDS[keyword]
  if (!defFunc) throw new Error("Unknown keyword " + keyword)
  return defFunc
}

export default ajvKeywordsPlugin
module.exports = ajvKeywordsPlugin
