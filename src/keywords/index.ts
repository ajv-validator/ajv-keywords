import {Plugin} from "ajv"
import typeofPlugin from "./typeof"
import instanceofPlugin from "./instanceof"
import range from "./range"
import exclusiveRange from "./exclusiveRange"
import regexp from "./regexp"

// TODO type
const ajvKeywords: Record<string, Plugin<any> | undefined> = {
  typeof: typeofPlugin,
  instanceof: instanceofPlugin,
  range,
  exclusiveRange,
  regexp,
  dynamicDefaults: require("./dynamicDefaults"),
  allRequired: require("./allRequired"),
  anyRequired: require("./anyRequired"),
  oneRequired: require("./oneRequired"),
  prohibited: require("./prohibited"),
  uniqueItemProperties: require("./uniqueItemProperties"),
  deepProperties: require("./deepProperties"),
  deepRequired: require("./deepRequired"),
  formatMinimum: require("./formatMinimum"),
  formatMaximum: require("./formatMaximum"),
  patternRequired: require("./patternRequired"),
  switch: require("./switch"),
  select: require("./select"),
  transform: require("./transform"),
}

export default ajvKeywords
module.exports = ajvKeywords
