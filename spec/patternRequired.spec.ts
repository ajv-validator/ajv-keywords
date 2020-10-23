import patternRequired from "../dist/keywords/patternRequired"
import patternRequiredDef from "../dist/definitions/patternRequired"
import getAjvInstances from "./ajv_instances"
import chai from "chai"

chai.should()

// const Ajv = require("ajv")
// const defFunc = require("../dist/keywords/patternRequired")
// const defineKeywords = require("../dist")
// require("chai").should()

describe.skip('keywords "patternRequired"', () => {
  const ajvs = getAjvInstances("instanceof", patternRequiredDef, patternRequired, {allErrors: true})
  const ajvsOP = getAjvInstances("instanceof", patternRequiredDef, patternRequired, {
    allErrors: true,
    ownProperties: true,
  })

  ajvs.forEach((ajv, i) => {
    it(`should only validate against own properties when using patternRequired #${i}`, () => {
      const ajvOP = ajvsOP[i]
      const schema = {type: "object", patternRequired: ["f.*o"]}

      class BazThing {
        foooo = false
        fooooooo = 42.31
      }

      class FooThing extends BazThing {
        bar?: number

        constructor(bar?: number) {
          super()
          if (bar) this.bar = bar
        }
      }
      const object = new FooThing(123)

      ajv.validate(schema, object).should.equal(true)
      ajvOP.validate(schema, object).should.equal(false)
      ajvOP.errors?.should.have.length(1)
    })
  })
})
