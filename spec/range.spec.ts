import Ajv from "ajv"
import rangePlugin from "../dist/keywords/range"
import ajvKeywordsPlugin from "../dist"
import chai from "chai"

// const ajvPack = require('ajv-pack');

const should = chai.should()

describe('keyword "range"', () => {
  const ajvs = [
    rangePlugin(new Ajv()),
    ajvKeywordsPlugin(new Ajv(), "range"),
    ajvKeywordsPlugin(new Ajv()),
    // defFunc(ajvPack.instance(new Ajv({sourceCode: true})))
  ]

  ajvs.forEach((ajv, i) => {
    it(`should validate that value is in range #${i}`, () => {
      const schema = {range: [1, 3]}
      ajv.validate(schema, 1).should.equal(true)
      ajv.validate(schema, 2).should.equal(true)
      ajv.validate(schema, 3).should.equal(true)
      ajv.validate(schema, 0.99).should.equal(false)
      ajv.validate(schema, 3.01).should.equal(false)

      ajv.validate({range: [1, 1]}, 1).should.equal(true)

      const schemaExcl = {range: [1, 3], exclusiveRange: true}
      ajv.validate(schemaExcl, 1).should.equal(false)
      ajv.validate(schemaExcl, 2).should.equal(true)
      ajv.validate(schemaExcl, 3).should.equal(false)
      ajv.validate(schemaExcl, 1.01).should.equal(true)
      ajv.validate(schemaExcl, 2.99).should.equal(true)
    })
  })

  ajvs.forEach((ajv, i) => {
    it(`should throw when range schema is invalid #${i}`, () => {
      ;[
        {range: [1, "3"]},
        {range: [1]},
        {range: [1, 2, 3]},
        {range: {}},
        {range: [3, 1]},

        {range: [1, 3], exclusiveRange: "true"},
        {range: [1, 1], exclusiveRange: true},
      ].forEach((schema) => {
        should.throw(() => {
          ajv.compile(schema)
        })
      })
    })
  })
})
