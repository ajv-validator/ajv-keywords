import {Plugin} from "ajv"
import getDef from "../definitions/exclusiveRange"

const exclusiveRangePlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(getDef())

export default exclusiveRangePlugin
module.exports = exclusiveRangePlugin
