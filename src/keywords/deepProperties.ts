import {Plugin} from "ajv"
import getDef from "../definitions/deepProperties"

const deepProperties: Plugin<undefined> = (ajv) => ajv.addKeyword(getDef())

export default deepProperties
module.exports = deepProperties
