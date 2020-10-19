"use strict"

const Ajv = require("ajv")
// var ajvPack = require('ajv-pack');
const defFunc = require("../dist/keywords/regexp")
const defineKeywords = require("../dist")
const should = require("chai").should()

describe('keyword "regexp"', () => {
  const ajvs = [
    defFunc(new Ajv()),
    defineKeywords(new Ajv({allErrors: true}, "regexp")),
    defineKeywords(new Ajv()),
    // defFunc(ajvPack.instance(new Ajv({sourceCode: true})))
  ]

  ajvs.forEach((ajv, i) => {
    it("should validate that values match regular expressions with flags #" + i, () => {
      const schema = {
        type: "object",
        properties: {
          foo: {regexp: "/foo/i"},
          bar: {regexp: {pattern: "bar", flags: "i"}},
        },
      }

      const validData = {
        foo: "Food",
        bar: "Barmen",
      }

      const alsoValidData = {
        foo: 1,
        bar: 2,
      }

      const invalidData = {
        foo: "fog",
        bar: "bad",
      }

      ajv.validate(schema, {}).should.equal(true)
      ajv.validate(schema, validData).should.equal(true)
      ajv.validate(schema, alsoValidData).should.equal(true)
      ajv.validate(schema, invalidData).should.equal(false)
    })
  })

  ajvs.forEach((ajv, i) => {
    it("should throw when regexp schema is invalid #" + i, () => {
      ;[
        {regexp: "/foo"}, // invalid regexp
        {regexp: "/foo/a"}, // invalid regexp 2
        {regexp: {pattern: "[a-z"}}, // invalid regexp
        {regexp: {pattern: "[a-z]", flags: "a"}}, // invalid flag
        {regexp: {flag: "i"}}, // missing pattern
        {regexp: {pattern: "[a-z]", flag: "i", foo: 1}}, // extra property
        {regexp: 1}, // incorrect type
        {regexp: {pattern: 1, flags: "i"}}, // incorrect type
      ].forEach((schema) => {
        should.throw(() => {
          ajv.compile(schema)
        })
      })
    })
  })
})
