import {Plugin} from "ajv"
import getDef from "../definitions/deepProperties"

const deepPropertiesPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(getDef())

export default deepPropertiesPlugin
module.exports = deepPropertiesPlugin
