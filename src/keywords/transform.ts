import type {Plugin} from "ajv"
import type {KeywordOptions} from "../definitions/_types"
import getDef from "../definitions/transform"

const transform: Plugin<KeywordOptions["transform"]> = (ajv, opts) => ajv.addKeyword(getDef(opts))

export default transform
module.exports = transform
