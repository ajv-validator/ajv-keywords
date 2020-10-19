import {Plugin} from "ajv"
import def from "../definitions/exclusiveRange"

const exclusiveRangePlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(def)

export default exclusiveRangePlugin
module.exports = exclusiveRangePlugin
