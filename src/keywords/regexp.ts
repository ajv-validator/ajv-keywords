import {Plugin} from "ajv"
import getDef from "../definitions/regexp"

const regexpPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(getDef())

export default regexpPlugin
module.exports = regexpPlugin
