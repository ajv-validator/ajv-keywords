import {Plugin} from "ajv"
import def from "../definitions/range"

const rangePlugin: Plugin<undefined> = (ajv) => {
  ajv.addKeyword(def)
  ajv.addKeyword("exclusiveRange")
  return ajv
}

export default rangePlugin
module.exports = rangePlugin
