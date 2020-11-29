import instanceofPlugin from "../dist/keywords/instanceof"
import instanceofDef from "../dist/definitions/instanceof"
import getAjvInstances from "./ajv_instances"
import chai from "chai"

const should = chai.should()

describe('keyword "instanceof"', () => {
  const ajvs = getAjvInstances("instanceof", instanceofDef, instanceofPlugin)

  ajvs.forEach((ajv, i) => {
    it(`should validate classes # ${i}`, () => {
      ajv.validate({instanceof: "Object"}, {}).should.equal(true)
      ajv.validate({instanceof: "Object"}, []).should.equal(true)
      ajv.validate({instanceof: "Object"}, "foo").should.equal(false)
      ajv.validate({instanceof: "Array"}, {}).should.equal(false)
      ajv.validate({instanceof: "Array"}, []).should.equal(true)
      ajv.validate({instanceof: "Array"}, "foo").should.equal(false)
      ajv.validate({instanceof: "Function"}, () => {}).should.equal(true)
      ajv.validate({instanceof: "Function"}, []).should.equal(false)
      ajv.validate({instanceof: "Number"}, new Number(42)).should.equal(true)
      ajv.validate({instanceof: "Number"}, 42).should.equal(false)
      ajv.validate({instanceof: "Number"}, "foo").should.equal(false)
      ajv.validate({instanceof: "String"}, new String("foo")).should.equal(true)
      ajv.validate({instanceof: "String"}, "foo").should.equal(false)
      ajv.validate({instanceof: "String"}, 42).should.equal(false)
      ajv.validate({instanceof: "Date"}, new Date()).should.equal(true)
      ajv.validate({instanceof: "Date"}, {}).should.equal(false)
      ajv.validate({instanceof: "RegExp"}, /.*/).should.equal(true)
      ajv.validate({instanceof: "RegExp"}, {}).should.equal(false)
      ajv.validate({instanceof: "Buffer"}, new Buffer("foo")).should.equal(true)
      ajv.validate({instanceof: "Buffer"}, "foo").should.equal(false)
      ajv.validate({instanceof: "Buffer"}, {}).should.equal(false)
      ajv.validate({instanceof: "Buffer"}, {}).should.equal(false)
      ajv.validate({instanceof: "Promise"}, Promise.resolve()).should.equal(true)
      ajv.validate({instanceof: "Promise"}, () => {}).should.equal(false)
    })

    it(`should validate multiple classes #${i}`, () => {
      ajv.validate({instanceof: ["Array", "Function"]}, []).should.equal(true)
      ajv.validate({instanceof: ["Array", "Function"]}, () => {}).should.equal(true)
      ajv.validate({instanceof: ["Array", "Function"]}, {}).should.equal(false)
    })

    it(`should allow adding classes #${i}`, () => {
      class MyClass {}

      should.throw(() => {
        ajv.compile({instanceof: "MyClass"})
      })

      instanceofDef.CONSTRUCTORS.MyClass = MyClass

      ajv.validate({instanceof: "MyClass"}, new MyClass()).should.equal(true)
      ajv.validate({instanceof: "Object"}, new MyClass()).should.equal(true)
      ajv.validate({instanceof: "MyClass"}, {}).should.equal(false)

      delete instanceofDef.CONSTRUCTORS.MyClass
      ajv.removeSchema()
    })

    it(`should throw when not string or array is passed #${i}`, () => {
      should.throw(() => {
        ajv.compile({instanceof: 1})
      })
    })
  })
})
