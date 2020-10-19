import {Vocabulary} from "ajv"
import typeofDef from "./typeof"
import instanceofDef from "./instanceof"
import rangeDef from "./range"

const ajvKeywordsDefs: Vocabulary = [typeofDef, instanceofDef, rangeDef, "exclusiveRange"]

export default ajvKeywordsDefs
module.exports = ajvKeywordsDefs
