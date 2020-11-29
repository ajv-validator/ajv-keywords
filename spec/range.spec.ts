import type Ajv from "ajv"
import rangePlugin from "../dist/keywords/range"
import rangeDef from "../dist/definitions/range"
import exclusiveRangePlugin from "../dist/keywords/exclusiveRange"
import exclusiveRangeDef from "../dist/definitions/exclusiveRange"
import getAjvInstances from "./ajv_instances"
import chai from "chai"
import ajvPack from "./ajv_pack"

const should = chai.should()

describe('keyword "range"', () => {
  const ajvs = getAjvInstances(
    ["range", "exclusiveRange"],
    [rangeDef, exclusiveRangeDef],
    (ajv: Ajv) => exclusiveRangePlugin(rangePlugin(ajv))
  )
  ajvs.push(exclusiveRangePlugin(rangePlugin(ajvPack())))

  ajvs.forEach((ajv, i) => {
    it(`should validate that value is in range #${i}`, () => {
      const schema = {type: "number", range: [1, 3]}
      ajv.validate(schema, 1).should.equal(true)
      ajv.validate(schema, 2).should.equal(true)
      ajv.validate(schema, 3).should.equal(true)
      ajv.validate(schema, 0.99).should.equal(false)
      ajv.validate(schema, 3.01).should.equal(false)

      ajv.validate({type: "number", range: [1, 1]}, 1).should.equal(true)

      const schemaExcl = {type: "number", exclusiveRange: [1, 3]}
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
        {type: "number", range: [1, "3"]},
        {type: "number", range: [1]},
        {type: "number", range: [1, 2, 3]},
        {type: "number", range: {}},
        {type: "number", range: [3, 1]},

        {type: "number", exclusiveRange: [1, "3"]},
        {type: "number", exclusiveRange: [1]},
        {type: "number", exclusiveRange: [1, 2, 3]},
        {type: "number", exclusiveRange: {}},
        {type: "number", exclusiveRange: [3, 1]},

        {type: "number", exclusiveRange: [1, 1]},
      ].forEach((schema) => {
        should.throw(() => {
          ajv.compile(schema)
        })
      })
    })
  })
})
