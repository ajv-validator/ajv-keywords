import {Vocabulary} from "ajv"
import {DefinitionOptions, GetDefinition} from "./_types"
import typeofDef from "./typeof"
import instanceofDef from "./instanceof"
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

const definitions: GetDefinition[] = [
  typeofDef,
  instanceofDef,
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
]

export default function ajvKeywords(opts?: DefinitionOptions): Vocabulary {
  return definitions.map((d) => d(opts))
}
