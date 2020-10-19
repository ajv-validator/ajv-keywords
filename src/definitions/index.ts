import {Vocabulary} from "ajv"
import typeofDef from "./typeof"
import instanceofDef from "./instanceof"
import range from "./range"
import exclusiveRange from "./exclusiveRange"
import regexp from "./regexp"

const ajvKeywordsDefs: Vocabulary = [typeofDef, instanceofDef, range, exclusiveRange, regexp]

export default ajvKeywordsDefs
module.exports = ajvKeywordsDefs
