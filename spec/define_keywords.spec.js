"use strict"

const Ajv = require("ajv")
const defineKeywords = require("../dist")
const should = require("chai").should()

describe("defineKeywords", () => {
  const ajv = new Ajv()

  it("should allow defining multiple keywords", () => {
    defineKeywords(ajv, ["typeof", "instanceof"])
    ajv.validate({typeof: "undefined"}, undefined).should.equal(true)
    ajv.validate({typeof: "undefined"}, {}).should.equal(false)
    ajv.validate({instanceof: "Array"}, []).should.equal(true)
    ajv.validate({instanceof: "Array"}, {}).should.equal(false)
  })

  it("should throw when unknown keyword is passed", () => {
    should.throw(() => {
      defineKeywords(ajv, "unknownKeyword")
    })

    should.throw(() => {
      defineKeywords(ajv, ["typeof", "unknownKeyword"])
    })
  })
})
