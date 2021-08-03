import type Ajv from "ajv"
import precisionPlugin from "../dist/keywords/precision"
import precisionDef from "../dist/definitions/precision"
import getAjvInstances from "./ajv_instances"
import chai from "chai"
import ajvPack from "./ajv_pack"

const should = chai.should()

describe('keyword "precision"', () => {
  const ajvs = getAjvInstances(["precision"], [precisionDef], (ajv: Ajv) => precisionPlugin(ajv))
  ajvs.push(precisionPlugin(ajvPack()))

  ajvs.forEach((ajv, i) => {
    it(`should validate that value has precision #${i}`, () => {
      const schema = {type: "number", precision: 2}
      ajv.validate(schema, 4).should.equal(true)
      ajv.validate(schema, 4.0).should.equal(true)
      ajv.validate(schema, 4.0).should.equal(true)
      ajv.validate(schema, 4.3).should.equal(true)
      ajv.validate(schema, 4.3).should.equal(true)
      ajv.validate(schema, 4.32).should.equal(true)
      ajv.validate(schema, 4.321).should.equal(false)
      ajv.validate(schema, 4.3219).should.equal(false)

      ajv.validate({type: "number", precision: 2}, 4.23).should.equal(true)
    })
  })

  ajvs.forEach((ajv, i) => {
    it(`should throw when precision schema is invalid #${i}`, () => {
      ;[
        {type: "number", precision: -1},
        {type: "number", precision: 101},
        {type: "number", precision: "1"},
        {type: "number", precision: "a"},
        {type: "number", precision: true},
        {type: "string", precision: 2},
      ].forEach((schema) => {
        should.throw(() => {
          ajv.compile(schema)
        })
      })
    })
  })
})
