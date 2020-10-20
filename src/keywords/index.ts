import {Plugin} from "ajv"
import typeofPlugin from "./typeof"
import instanceofPlugin from "./instanceof"
import range from "./range"
import exclusiveRange from "./exclusiveRange"
import regexp from "./regexp"
import transform from "./transform"
import allRequired from "./allRequired"
import anyRequired from "./anyRequired"
import oneRequired from "./oneRequired"
import prohibited from "./prohibited"
import deepProperties from "./deepProperties"

// TODO type
const ajvKeywords: Record<string, Plugin<any> | undefined> = {
  typeof: typeofPlugin,
  instanceof: instanceofPlugin,
  range,
  exclusiveRange,
  regexp,
  transform,
  allRequired,
  anyRequired,
  oneRequired,
  prohibited,
  deepProperties,
  dynamicDefaults: require("./dynamicDefaults"),
  uniqueItemProperties: require("./uniqueItemProperties"),
  deepRequired: require("./deepRequired"),
  formatMinimum: require("./formatMinimum"),
  formatMaximum: require("./formatMaximum"),
  patternRequired: require("./patternRequired"),
  switch: require("./switch"),
  select: require("./select"),
}

export default ajvKeywords
module.exports = ajvKeywords
