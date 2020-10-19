import {Plugin} from "ajv"
import def from "../definitions/allRequired"

const allRequiredPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(def)

export default allRequiredPlugin
module.exports = allRequiredPlugin
