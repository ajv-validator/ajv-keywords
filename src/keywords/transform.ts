import {Plugin} from "ajv"
import def from "../definitions/transform"

const transformPlugin: Plugin<undefined> = (ajv) => ajv.addKeyword(def)

export default transformPlugin
module.exports = transformPlugin
