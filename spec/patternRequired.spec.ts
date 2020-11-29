import patternRequired from "../dist/keywords/patternRequired"
import patternRequiredDef from "../dist/definitions/patternRequired"
import getAjvInstances from "./ajv_instances"
import chai from "chai"
// import ajvPack from "./ajv_pack"
chai.should()

describe('keywords "patternRequired"', () => {
  const opts = {allErrors: true}
  const ajvs = getAjvInstances("patternRequired", patternRequiredDef, patternRequired, opts)
  // ajvs.push(patternRequired(ajvPack(opts)))
  const optsOP = {allErrors: true, ownProperties: true}
  const ajvsOP = getAjvInstances("patternRequired", patternRequiredDef, patternRequired, optsOP)
  // ajvsOP.push(patternRequired(ajvPack(optsOP)))

  ajvs.forEach((ajv, i) => {
    it(`should only validate against own properties when using patternRequired #${i}`, () => {
      const ajvOP = ajvsOP[i]
      const schema = {type: "object", patternRequired: ["f.*o"]}

      const baz = {foooo: false, fooooooo: 42.31}

      type Constructor = new () => any

      function FooThing(this: any): any {
        this.bar = 123
      }
      FooThing.prototype = baz
      const object = new ((FooThing as unknown) as Constructor)()

      ajv.validate(schema, object).should.equal(true)
      ajvOP.validate(schema, object).should.equal(false)
      ajvOP.errors?.should.have.length(1)
    })
  })
})
