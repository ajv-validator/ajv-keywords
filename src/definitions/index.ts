import {Vocabulary} from "ajv"
import typeofDef from "./typeof"
import instanceofDef from "./instanceof"
import range from "./range"
import exclusiveRange from "./exclusiveRange"

const ajvKeywordsDefs: Vocabulary = [typeofDef, instanceofDef, range, exclusiveRange]

export default ajvKeywordsDefs
module.exports = ajvKeywordsDefs
