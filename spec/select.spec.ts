import selectPlugin from "../dist/keywords/select"
import selectDef from "../dist/definitions/select"
import ajvKeywordsPlugin from "../dist"
import ajvKeywords from "../dist/definitions"
import Ajv from "ajv"
import chai from "chai"
import ajvPack from "./ajv_pack"
const should = chai.should()

describe('keyword "select"', () => {
  describe("invalid schema", () => {
    const ajvs = [
      selectPlugin(new Ajv({$data: true})),
      selectPlugin(new Ajv({$data: true, allErrors: true})),
      new Ajv({$data: true, keywords: selectDef()}),
      ajvKeywordsPlugin(new Ajv({$data: true}), "select"),
      ajvKeywordsPlugin(new Ajv({$data: true})),
      new Ajv({$data: true, keywords: ajvKeywords()}),
      new Ajv({$data: true}).addVocabulary(ajvKeywords()),
      selectPlugin(ajvPack({$data: true})),
    ]

    ajvs.forEach((ajv, i) => {
      it(`should throw - "select" requires "selectCases" #${i}`, () => {
        should.throw(() => {
          ajv.compile({
            select: {$data: "0/type"},
          })
        })
      })

      it(`should NOT throw during validation #${i}`, () => {
        const validate = ajv.compile({
          select: {$data: "0/type"},
          selectCases: {
            foo: true,
            bar: true,
          },
          selectDefault: false,
        })

        validate({type: "foo"}).should.equal(true)
        validate({type: "bar"}).should.equal(true)
        validate({type: "unknown"}).should.equal(false)
        validate({}).should.equal(true)
      })
    })
  })
})
