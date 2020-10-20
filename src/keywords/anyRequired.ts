import {Plugin} from "ajv"
import getDef from "../definitions/anyRequired"

const anyRequiredPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(getDef())

export default anyRequiredPlugin
module.exports = anyRequiredPlugin
