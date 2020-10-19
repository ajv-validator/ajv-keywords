import {Plugin} from "ajv"
import def from "../definitions/instanceof"

const instanceofPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(def)

export default instanceofPlugin
module.exports = instanceofPlugin
