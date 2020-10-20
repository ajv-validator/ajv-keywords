import {Plugin} from "ajv"
import getDef from "../definitions/prohibited"

const prohibitedPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(getDef())

export default prohibitedPlugin
module.exports = prohibitedPlugin
