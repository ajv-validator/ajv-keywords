import Ajv from "ajv"
import ajvKeywordsPlugin from "../dist"
import chai from "chai"

const should = chai.should()

describe("defineKeywords", () => {
  const ajv = new Ajv()

  it("should allow defining multiple keywords", () => {
    ajvKeywordsPlugin(ajv, ["typeof", "instanceof"])
    ajv.validate({typeof: "undefined"}, undefined).should.equal(true)
    ajv.validate({typeof: "undefined"}, {}).should.equal(false)
    ajv.validate({instanceof: "Array"}, []).should.equal(true)
    ajv.validate({instanceof: "Array"}, {}).should.equal(false)
  })

  it("should throw when unknown keyword is passed", () => {
    should.throw(() => {
      ajvKeywordsPlugin(ajv, "unknownKeyword")
    })

    should.throw(() => {
      ajvKeywordsPlugin(ajv, ["typeof", "unknownKeyword"])
    })
  })
})
