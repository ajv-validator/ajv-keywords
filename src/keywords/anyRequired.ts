import {Plugin} from "ajv"
import def from "../definitions/anyRequired"

const anyRequiredPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(def)

export default anyRequiredPlugin
module.exports = anyRequiredPlugin
