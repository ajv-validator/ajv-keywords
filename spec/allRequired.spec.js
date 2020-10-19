"use strict"

const Ajv = require("ajv")
// var ajvPack = require('ajv-pack');
const defFunc = require("../dist/keywords/allRequired")
const defineKeywords = require("../dist")
const should = require("chai").should()

describe('keyword "allRequired"', () => {
  const ajvs = [
    defFunc(new Ajv()),
    defineKeywords(new Ajv(), "allRequired"),
    defineKeywords(new Ajv()),
    // defFunc(ajvPack.instance(new Ajv({sourceCode: true})))
  ]

  ajvs.forEach((ajv, i) => {
    it("should validate that all defined properties are present #" + i, () => {
      const schema = {
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
    it("should throw when properties is absent #" + i, () => {
      should.throw(() => {
        ajv.compile({allRequired: true})
      })
    })
  })

  ajvs.forEach((ajv, i) => {
    it("should throw when allRequired schema is invalid #" + i, () => {
      should.throw(() => {
        ajv.compile({properties: {foo: true}, allRequired: 1})
      })
    })
  })
})
