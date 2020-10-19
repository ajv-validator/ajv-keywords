"use strict"

const Ajv = require("ajv")
// var ajvPack = require('ajv-pack');
const defFunc = require("../dist/keywords/typeof")
const defineKeywords = require("../dist")
const should = require("chai").should()

describe('keyword "typeof"', () => {
  const ajvs = [
    defFunc(new Ajv()),
    defineKeywords(new Ajv(), "typeof"),
    defineKeywords(new Ajv()),
    // defFunc(ajvPack.instance(new Ajv({sourceCode: true})))
  ]

  ajvs.forEach((ajv, i) => {
    it("should validate value types #" + i, () => {
      ajv.validate({typeof: "undefined"}, undefined).should.equal(true)
      ajv.validate({typeof: "undefined"}, null).should.equal(false)
      ajv.validate({typeof: "undefined"}, "foo").should.equal(false)
      ajv.validate({typeof: "function"}, () => {}).should.equal(true)
      ajv.validate({typeof: "function"}, {}).should.equal(false)
      ajv.validate({typeof: "object"}, {}).should.equal(true)
      ajv.validate({typeof: "object"}, null).should.equal(true)
      ajv.validate({typeof: "object"}, "foo").should.equal(false)
      ajv.validate({typeof: "symbol"}, Symbol()).should.equal(true)
      ajv.validate({typeof: "symbol"}, {}).should.equal(false)
    })

    it("should validate multiple types #" + i, () => {
      ajv.validate({typeof: ["string", "function"]}, "foo").should.equal(true)
      ajv.validate({typeof: ["string", "function"]}, () => {}).should.equal(true)
      ajv.validate({typeof: ["string", "function"]}, {}).should.equal(false)
    })

    it("should throw when unknown type is passed #" + i, () => {
      should.throw(() => {
        ajv.compile({typeof: "unknownType"})
      })

      should.throw(() => {
        ajv.compile({typeof: ["string", "unknownType"]})
      })
    })

    it("should throw when not string or array is passed #" + i, () => {
      should.throw(() => {
        ajv.compile({typeof: 1})
      })
    })
  })
})
