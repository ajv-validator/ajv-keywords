import {Plugin} from "ajv"
import def from "../definitions/oneRequired"

const oneRequiredPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(def)

export default oneRequiredPlugin
module.exports = oneRequiredPlugin
