import type {Plugin} from "ajv"
import getDef from "../definitions/precision"

const precision: Plugin<undefined> = (ajv) => ajv.addKeyword(getDef())

export default precision
module.exports = precision
