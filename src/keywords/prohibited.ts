import {Plugin} from "ajv"
import def from "../definitions/prohibited"

const prohibitedPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(def)

export default prohibitedPlugin
module.exports = prohibitedPlugin
