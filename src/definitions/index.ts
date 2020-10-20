import {Vocabulary} from "ajv"
import typeofDef from "./typeof"
import instanceofDef from "./instanceof"
import range from "./range"
import exclusiveRange from "./exclusiveRange"
import regexp from "./regexp"
import transform from "./transform"
import allRequired from "./allRequired"
import anyRequired from "./anyRequired"

const ajvKeywordsDefs: Vocabulary = [
  typeofDef,
  instanceofDef,
  range,
  exclusiveRange,
  regexp,
  transform,
  allRequired,
  anyRequired,
]

export default ajvKeywordsDefs
module.exports = ajvKeywordsDefs
