"use strict"

const TIME = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d:\d\d)?$/i
const DATE_TIME_SEPARATOR = /t|\s/i

const COMPARE_FORMATS = {
  date: compareDate,
  time: compareTime,
  "date-time": compareDateTime,
}

const $dataMetaSchema = {
  type: "object",
  required: ["$data"],
  properties: {
    $data: {
      type: "string",
      anyOf: [{format: "relative-json-pointer"}, {format: "json-pointer"}],
    },
  },
  additionalProperties: false,
}

module.exports = function (minMax) {
  const keyword = "format" + minMax
  return function defFunc(ajv) {
    defFunc.definition = {
      type: "string",
      inline: require("./dotjs/_formatLimit"),
      statements: true,
      errors: "full",
      dependencies: ["format"],
      metaSchema: {
        anyOf: [{type: "string"}, $dataMetaSchema],
      },
    }

    ajv.addKeyword(keyword, defFunc.definition)
    ajv.addKeyword("formatExclusive" + minMax, {
      dependencies: ["format" + minMax],
      metaSchema: {
        anyOf: [{type: "boolean"}, $dataMetaSchema],
      },
    })
    extendFormats(ajv)
    return ajv
  }
}

function extendFormats(ajv) {
  const {formats} = ajv
  for (const name in COMPARE_FORMATS) {
    let format = formats[name]
    // the last condition is needed if it's RegExp from another window
    if (typeof format != "object" || format instanceof RegExp || !format.validate) {
      format = formats[name] = {validate: format}
    }
    if (!format.compare) format.compare = COMPARE_FORMATS[name]
  }
}

function compareDate(d1, d2) {
  if (!(d1 && d2)) return
  if (d1 > d2) return 1
  if (d1 < d2) return -1
  if (d1 === d2) return 0
}

function compareTime(t1, t2) {
  if (!(t1 && t2)) return
  t1 = t1.match(TIME)
  t2 = t2.match(TIME)
  if (!(t1 && t2)) return
  t1 = t1[1] + t1[2] + t1[3] + (t1[4] || "")
  t2 = t2[1] + t2[2] + t2[3] + (t2[4] || "")
  if (t1 > t2) return 1
  if (t1 < t2) return -1
  if (t1 === t2) return 0
}

function compareDateTime(dt1, dt2) {
  if (!(dt1 && dt2)) return
  dt1 = dt1.split(DATE_TIME_SEPARATOR)
  dt2 = dt2.split(DATE_TIME_SEPARATOR)
  const res = compareDate(dt1[0], dt2[0])
  if (res === undefined) return
  return res || compareTime(dt1[1], dt2[1])
}
