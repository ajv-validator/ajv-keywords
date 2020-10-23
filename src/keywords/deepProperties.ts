import {Plugin} from "ajv"
import getDef from "../definitions/deepProperties"
import {DefinitionOptions} from "../definitions/_types"

const deepProperties: Plugin<DefinitionOptions> = (ajv, opts?: DefinitionOptions) =>
  ajv.addKeyword(getDef(opts))

export default deepProperties
module.exports = deepProperties
