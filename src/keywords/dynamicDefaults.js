"use strict"

const sequences = {}

const DEFAULTS = {
  timestamp: function () {
    return Date.now()
  },
  datetime: function () {
    return new Date().toISOString()
  },
  date: function () {
    return new Date().toISOString().slice(0, 10)
  },
  time: function () {
    return new Date().toISOString().slice(11)
  },
  random: function () {
    return Math.random()
  },
  randomint: function (args) {
    const limit = (args && args.max) || 2
    return function () {
      return Math.floor(Math.random() * limit)
    }
  },
  seq: function (args) {
    const name = (args && args.name) || ""
    sequences[name] = sequences[name] || 0
    return function () {
      return sequences[name]++
    }
  },
}

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    compile: function (schema, parentSchema, it) {
      const funcs = {}

      for (const key in schema) {
        const d = schema[key]
        const func = getDefault(typeof d == "string" ? d : d.func)
        funcs[key] = func.length ? func(d.args) : func
      }

      return it.opts.useDefaults && !it.compositeRule ? assignDefaults : noop

      function assignDefaults(data) {
        for (const prop in schema) {
          if (
            data[prop] === undefined ||
            (it.opts.useDefaults === "empty" && (data[prop] === null || data[prop] === ""))
          ) {
            data[prop] = funcs[prop]()
          }
        }
        return true
      }

      function noop() {
        return true
      }
    },
    DEFAULTS: DEFAULTS,
    metaSchema: {
      type: "object",
      additionalProperties: {
        type: ["string", "object"],
        additionalProperties: false,
        required: ["func", "args"],
        properties: {
          func: {type: "string"},
          args: {type: "object"},
        },
      },
    },
  }

  ajv.addKeyword("dynamicDefaults", defFunc.definition)
  return ajv

  function getDefault(d) {
    const def = DEFAULTS[d]
    if (def) return def
    throw new Error('invalid "dynamicDefaults" keyword property value: ' + d)
  }
}
