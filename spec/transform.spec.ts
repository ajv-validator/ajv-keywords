import Ajv from "ajv"
import transformPlugin from "../dist/keywords/transform"
import transformDef from "../dist/definitions/transform"
import ajvKeywordsPlugin from "../dist"
import ajvKeywords from "../dist/definitions"
import chai from "chai"

chai.should()

describe('keyword "transform"', () => {
  const ajvs = [
    transformPlugin(new Ajv({allowUnionTypes: true})),
    new Ajv({keywords: [transformDef], allowUnionTypes: true}),
    ajvKeywordsPlugin(new Ajv({allowUnionTypes: true}), "transform"),
    new Ajv({keywords: ajvKeywords, allowUnionTypes: true}),
    new Ajv({allowUnionTypes: true}).addVocabulary(ajvKeywords),
    // ajvKeywordsPlugin(new Ajv()),
  ]

  ajvs.forEach((ajv, i) => {
    it(`should transform by wrapper #${i}`, () => {
      let schema, data

      data = {o: "  Object  "}
      schema = {
        type: "object",
        properties: {o: {type: "string", transform: ["trim", "toLowerCase"]}},
      }
      ajv.validate(schema, data).should.equal(true)
      data.should.deep.equal({o: "object"})

      data = ["  Array  "]
      schema = {type: "array", items: {type: "string", transform: ["trim", "toUpperCase"]}}
      ajv.validate(schema, data).should.equal(true)
      data.should.deep.equal(["ARRAY"])

      data = "  String  "
      schema = {type: "string", transform: ["trim", "toLowerCase"]}
      ajv.validate(schema, data).should.equal(true)
      // Note: Doesn't work on plain strings due to object being undefined
      data.should.equal("  String  ")
    })
  })

  ajvs.forEach((ajv, i) => {
    it(`should not transform non-strings #${i}`, () => {
      const data = ["a", 1, null, [], {}]
      const schema = {type: "array", items: {type: "string", transform: ["toUpperCase"]}}
      ajv.validate(schema, data).should.equal(false)
      data.should.deep.equal(["A", 1, null, [], {}])
    })
  })

  ajvs.forEach((ajv, i) => {
    it(`should transform trim #${i}`, () => {
      let schema, data

      data = ["  trimObject  "]
      schema = {type: "array", items: {type: "string", transform: ["trimLeft"]}}
      ajv.validate(schema, data).should.equal(true)
      data.should.deep.equal(["trimObject  "])

      data = ["  trimObject  "]
      schema = {type: "array", items: {type: "string", transform: ["trimRight"]}}
      ajv.validate(schema, data).should.equal(true)
      data.should.deep.equal(["  trimObject"])

      data = ["  trimObject  "]
      schema = {type: "array", items: {type: "string", transform: ["trimLeft", "trimRight"]}}
      ajv.validate(schema, data).should.equal(true)
      data.should.deep.equal(["trimObject"])

      data = ["  trimObject  "]
      schema = {type: "array", items: {type: "string", transform: ["trim"]}}
      ajv.validate(schema, data).should.equal(true)
      data.should.deep.equal(["trimObject"])
    })
  })

  ajvs.forEach((ajv, i) => {
    it(`should transform text case #${i}`, () => {
      let schema, data

      data = ["MixCase"]
      schema = {type: "array", items: {type: "string", transform: ["toLowerCase"]}}
      ajv.validate(schema, data).should.equal(true)
      data.should.deep.equal(["mixcase"])

      data = ["MixCase"]
      schema = {type: "array", items: {type: "string", transform: ["toUpperCase"]}}
      ajv.validate(schema, data).should.equal(true)
      data.should.deep.equal(["MIXCASE"])

      data = ["ph", "PH", "pH", "Ph"]
      schema = {type: "array", items: {type: "string", transform: ["toEnumCase"], enum: ["pH"]}}
      ajv.validate(schema, data).should.equal(true)
      data.should.deep.equal(["pH", "pH", "pH", "pH"])

      data = ["ph", "PH", "pH", "Ph", 7]
      schema = {
        type: "array",
        items: {type: ["string", "integer"], transform: ["toEnumCase"], enum: ["pH", 7]},
      }
      ajv.validate(schema, data).should.equal(true)
      data.should.deep.equal(["pH", "pH", "pH", "pH", 7])

      data = ["ph"]
      schema = {type: "array", items: {type: "string", transform: ["toEnumCase"]}}
      try {
        ajv.validate(schema, data).should.equal(false)
      } catch (e) {
        e.message.should.equal(
          'Missing enum. To use `transform:["toEnumCase"]`, `enum:[...]` is required.'
        )
      }

      data = ["ph"]
      schema = {
        type: "array",
        items: {type: "string", transform: ["toEnumCase"], enum: ["pH", "PH"]},
      }
      try {
        ajv.validate(schema, data).should.equal(false)
      } catch (e) {
        e.message.should.equal(
          'Invalid enum uniqueness. To use `transform:["toEnumCase"]`, all values must be unique when case insensitive.'
        )
      }

      data = ["  ph  "]
      schema = {
        type: "array",
        items: {type: "string", transform: ["trim", "toEnumCase"], enum: ["pH"]},
      }
      ajv.validate(schema, data).should.equal(true)
      data.should.deep.equal(["pH"])

      data = ["ab"]
      schema = {type: "array", items: {type: "string", transform: ["toEnumCase"], enum: ["pH"]}}
      ajv.validate(schema, data).should.equal(false)
      data.should.deep.equal(["ab"])
    })
  })
})
