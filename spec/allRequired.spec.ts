import allRequiredPlugin from "../dist/keywords/allRequired"
import allRequiredDef from "../dist/definitions/allRequired"
import getAjvInstances from "./ajv_instances"
import chai from "chai"
import ajvPack from "./ajv_pack"
const should = chai.should()

describe('keyword "allRequired"', () => {
  const ajvs = getAjvInstances("allRequired", allRequiredDef, allRequiredPlugin)
  ajvs.push(allRequiredPlugin(ajvPack()))

  ajvs.forEach((ajv, i) => {
    it(`should validate that all defined properties are present #${i}`, () => {
      const schema = {
        type: "object",
        properties: {
          foo: true,
          bar: true,
        },
        allRequired: true,
      }
      ajv.validate(schema, {foo: 1, bar: 2}).should.equal(true)
      ajv.validate(schema, {foo: 1}).should.equal(false)
    })
  })

  ajvs.forEach((ajv, i) => {
    it(`should throw when properties is absent #${i}`, () => {
      should.throw(() => {
        ajv.compile({type: "object", allRequired: true})
      })
    })
  })

  ajvs.forEach((ajv, i) => {
    it(`should throw when allRequired schema is invalid #${i}`, () => {
      should.throw(() => {
        ajv.compile({type: "object", properties: {foo: true}, allRequired: 1})
      })
    })
  })
})
