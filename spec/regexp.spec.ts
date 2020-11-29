import regexpPlugin from "../dist/keywords/regexp"
import regexpDef from "../dist/definitions/regexp"
import getAjvInstances from "./ajv_instances"
import chai from "chai"
import ajvPack from "./ajv_pack"
const should = chai.should()

describe('keyword "regexp"', () => {
  const ajvs = getAjvInstances("regexp", regexpDef, regexpPlugin, {logger: false})
  ajvs.push(regexpPlugin(ajvPack()))

  ajvs.forEach((ajv, i) => {
    it(`should validate that values match regular expressions with flags #${i}`, () => {
      const schema = {
        type: "object",
        properties: {
          foo: {type: "string", regexp: "/foo/i"},
          bar: {type: "string", regexp: {pattern: "bar", flags: "i"}},
        },
      }

      const validData = {
        foo: "Food",
        bar: "Barmen",
      }

      const invalidData = {
        foo: "fog",
        bar: "bad",
      }

      ajv.validate(schema, {}).should.equal(true)
      ajv.validate(schema, validData).should.equal(true)
      ajv.validate(schema, invalidData).should.equal(false)
    })
  })

  ajvs.forEach((ajv, i) => {
    it(`should throw when regexp schema is invalid #${i}`, () => {
      ;[
        {type: "string", regexp: "/foo"}, // invalid regexp
        {type: "string", regexp: "/foo/a"}, // invalid regexp 2
        {type: "string", regexp: {pattern: "[a-z"}}, // invalid regexp
        {type: "string", regexp: {pattern: "[a-z]", flags: "a"}}, // invalid flag
        {type: "string", regexp: {flag: "i"}}, // missing pattern
        {type: "string", regexp: {pattern: "[a-z]", flag: "i", foo: 1}}, // extra property
        {type: "string", regexp: 1}, // incorrect type
        {type: "string", regexp: {pattern: 1, flags: "i"}}, // incorrect type
      ].forEach((schema) => {
        should.throw(() => {
          ajv.compile(schema)
        })
      })
    })
  })
})
