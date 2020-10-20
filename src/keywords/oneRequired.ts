import {Plugin} from "ajv"
import getDef from "../definitions/oneRequired"

const oneRequiredPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(getDef())

export default oneRequiredPlugin
module.exports = oneRequiredPlugin
