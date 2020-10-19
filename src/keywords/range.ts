import {Plugin} from "ajv"
import def from "../definitions/range"

const rangePlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(def)

export default rangePlugin
module.exports = rangePlugin
