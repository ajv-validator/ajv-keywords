"use strict"

const Ajv = require("ajv")
const defFunc = require("../dist/keywords/formatMaximum")
const defineKeywords = require("../dist")
const should = require("chai").should()

describe('keywords "formatMinimum" and "formatMaximum"', () => {
  const ajvs = getAjvs(true)
  const ajvsFF = getAjvs(false)

  ajvs.forEach((ajv, i) => {
    it("should not validate formatMaximum/Minimum if option format == false #" + i, () => {
      const ajvFF = ajvsFF[i]

      const schema = {
        format: "date",
        formatMaximum: "2015-08-01",
      }

      const date = "2015-09-01"
      ajv.validate(schema, date).should.equal(false)
      ajvFF.validate(schema, date).should.equal(true)
    })
  })

  ajvs.forEach((ajv, i) => {
    it('should throw when "format" is absent #' + i, () => {
      should.throw(() => {
        ajv.compile({formatMaximum: "2015-08-01"})
      })
    })
  })

  ajvs.forEach((ajv, i) => {
    it("formatExclusiveMaximum should throw if not boolean #" + i, () => {
      should.throw(() => {
        ajv.compile({formatMaximum: "2015-08-01", formatExclusiveMaximum: 1})
      })
    })
  })

  ajvs.forEach((ajv, i) => {
    it('formatExclusiveMaximum should throw when "formatMaximum" is absent #' + i, () => {
      should.throw(() => {
        ajv.compile({formatExclusiveMaximum: true})
      })
    })
  })

  function getAjv(format) {
    return new Ajv({allErrors: true, format: format})
  }

  function getAjvs(format) {
    return [
      defFunc(getAjv(format)),
      defineKeywords(getAjv(format), "formatMaximum"),
      defineKeywords(getAjv(format)),
    ]
  }
})
