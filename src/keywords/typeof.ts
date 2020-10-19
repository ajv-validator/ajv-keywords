import {Plugin} from "ajv"
import def from "../definitions/typeof"

const typeofPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(def)

export default typeofPlugin
module.exports = typeofPlugin
