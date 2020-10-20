import {Plugin} from "ajv"
import getDef from "../definitions/range"

const rangePlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(getDef())

export default rangePlugin
module.exports = rangePlugin
