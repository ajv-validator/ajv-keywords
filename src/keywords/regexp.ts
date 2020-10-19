import {Plugin} from "ajv"
import def from "../definitions/regexp"

const regexpPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(def)

export default regexpPlugin
module.exports = regexpPlugin
