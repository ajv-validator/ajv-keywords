import {Plugin} from "ajv"
import typeofPlugin from "./typeof"
import instanceofPlugin from "./instanceof"
import range from "./range"
import exclusiveRange from "./exclusiveRange"
import regexp from "./regexp"
import transform from "./transform"
import uniqueItemProperties from "./uniqueItemProperties"
import allRequired from "./allRequired"
import anyRequired from "./anyRequired"
import oneRequired from "./oneRequired"
import prohibited from "./prohibited"
import deepProperties from "./deepProperties"
import deepRequired from "./deepRequired"
import dynamicDefaults from "./dynamicDefaults"

// TODO type
const ajvKeywords: Record<string, Plugin<any> | undefined> = {
  typeof: typeofPlugin,
  instanceof: instanceofPlugin,
  range,
  exclusiveRange,
  regexp,
  transform,
  uniqueItemProperties,
  allRequired,
  anyRequired,
  oneRequired,
  prohibited,
  deepProperties,
  deepRequired,
  dynamicDefaults,
  formatMinimum: require("./formatMinimum"),
  formatMaximum: require("./formatMaximum"),
  patternRequired: require("./patternRequired"),
  select: require("./select"),
}

export default ajvKeywords
module.exports = ajvKeywords
