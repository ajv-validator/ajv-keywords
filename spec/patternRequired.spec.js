"use strict"

const Ajv = require("ajv")
const defFunc = require("../dist/keywords/patternRequired")
const defineKeywords = require("../dist")
require("chai").should()

describe('keywords "patternRequired"', () => {
  const ajvs = getAjvs()
  const ajvsOP = getAjvs(true)

  ajvs.forEach((ajv, i) => {
    it("should only validate against own properties when using patternRequired #" + i, () => {
      const ajvOP = ajvsOP[i]
      const schema = {patternRequired: ["f.*o"]}

      const baz = {foooo: false, fooooooo: 42.31}
      function FooThing() {
        this.bar = 123
      }
      FooThing.prototype = baz
      const object = new FooThing()

      ajv.validate(schema, object).should.equal(true)
      ajvOP.validate(schema, object).should.equal(false)
      ajvOP.errors.should.have.length(1)
    })
  })

  function getAjv(ownProperties) {
    return new Ajv({allErrors: true, ownProperties: ownProperties})
  }

  function getAjvs(ownProperties) {
    return [
      defFunc(getAjv(ownProperties)),
      defineKeywords(getAjv(ownProperties), "patternRequired"),
      defineKeywords(getAjv(ownProperties)),
    ]
  }
})
