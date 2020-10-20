import {Plugin} from "ajv"
import getDef from "../definitions/transform"

const transformPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(getDef())

export default transformPlugin
module.exports = transformPlugin
