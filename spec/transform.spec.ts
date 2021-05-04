import transformPlugin from "../dist/keywords/transform"
import transformDef from "../dist/definitions/transform"
import getAjvInstances from "./ajv_instances"
import ajvPack from "./ajv_pack"
import chai from "chai"
chai.should()

describe('keyword "transform"', () => {
  const ajvs = getAjvInstances("transform", transformDef, transformPlugin, {allowUnionTypes: true})
  ajvs.push(transformPlugin(ajvPack({allowUnionTypes: true})))

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
      schema = {type: "array", items: {type: "string", transform: ["trimStart", "trimEnd"]}}
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
        e.message.should.match(/transform.*enum/)
      }

      data = ["ph"]
      schema = {
        type: "array",
        items: {type: "string", transform: ["toEnumCase"], enum: ["pH", "PH"]},
      }
      try {
        ajv.validate(schema, data).should.equal(false)
      } catch (e) {
        e.message.should.match(/transform.*unique/)
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

  ajvs.forEach((ajv, i) => {
    it(`shouldn't mutate the transform array of the schema while compiling it #${i}`, () => {
      const data = {p: "  trimObject  "}
      const schema = {type: "object", properties: {p: {type: "string", transform: ["trimLeft"]}}}
      ajv.validate(schema, data).should.equal(true)
      data.should.deep.equal({p: "trimObject  "})

      schema.properties.p.transform.should.deep.equal(["trimLeft"])
    })
  })
})
