import {Plugin} from "ajv"
import getDef from "../definitions/allRequired"

const allRequiredPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(getDef())

export default allRequiredPlugin
module.exports = allRequiredPlugin
