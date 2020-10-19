import {Plugin} from "ajv"
import def from "../definitions/typeof"

const typeofPlugin: Plugin<never> = (ajv) => ajv.addKeyword(def)

export default typeofPlugin
module.exports = typeofPlugin
