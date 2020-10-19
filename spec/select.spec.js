"use strict"

const Ajv = require("ajv")
const defFunc = require("../dist/keywords/select")
const defineKeywords = require("../dist")
const should = require("chai").should()

describe('keyword "select"', () => {
  describe("invalid schema", () => {
    const ajvs = [
      defFunc(new Ajv({$data: true})),
      defineKeywords(new Ajv({$data: true}), "select"),
      defineKeywords(new Ajv({$data: true, allErrors: true})),
    ]

    ajvs.forEach((ajv, i) => {
      it("should throw during validation #" + i, () => {
        const validate = ajv.compile({
          select: {$data: "0/type"},
        })

        should.throw(() => {
          validate({type: "foo"})
        })
      })

      it("should NOT throw during validation #" + i, () => {
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
