import Ajv from "ajv"
import allRequiredPlugin from "../dist/keywords/allRequired"
import allRequiredDef from "../dist/definitions/allRequired"
import ajvKeywordsPlugin from "../dist"
import ajvKeywords from "../dist/definitions"
import chai from "chai"

// var ajvPack = require('ajv-pack');

const should = chai.should()

describe('keyword "allRequired"', () => {
  const ajvs = [
    allRequiredPlugin(new Ajv()),
    new Ajv({keywords: [allRequiredDef]}),
    ajvKeywordsPlugin(new Ajv(), "allRequired"),
    new Ajv({keywords: ajvKeywords}),
    new Ajv().addVocabulary(ajvKeywords),
    // ajvKeywordsPlugin(new Ajv()),
    // defFunc(ajvPack.instance(new Ajv({sourceCode: true})))
  ]

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
