import dynamicDefaults from "../dist/keywords/dynamicDefaults"
import dynamicDefaultsDef from "../dist/definitions/dynamicDefaults"
import getAjvInstances from "./ajv_instances"
import Ajv from "ajv"
import {fullFormats} from "ajv-formats/dist/formats"
import chai from "chai"
import assert from "assert"
import {v4 as uuidv4} from "uuid"

const should = chai.should()

describe('keyword "dynamicDefaults"', () => {
  const ajvs = getAjvInstances("dynamicDefaults", dynamicDefaultsDef, dynamicDefaults, {
    useDefaults: true,
    formats: fullFormats,
  })

  ajvs.forEach((ajv, i) => {
    it(`should assign defaults #${i}`, (done) => {
      const schema = {
        type: "object",
        dynamicDefaults: {
          ts: "timestamp",
          dt: "datetime",
          d: "date",
          t: "time",
          r: "random",
          ri: "randomint",
          riN: {func: "randomint", args: {max: 1000000}},
          s: "seq",
          sN: {func: "seq", args: {name: "foo"}},
        },
      }

      const validate = ajv.compile(schema)
      const data: Record<string, any> = {}
      validate(data).should.equal(true)
      test(data)
      data.s.should.equal(2 * i)
      data.sN.should.equal(2 * i)

      setTimeout(() => {
        const data1: Record<string, any> = {}
        validate(data1).should.equal(true)
        test(data1)
        assert(data.ts < data1.ts)
        assert.notStrictEqual(data.dt, data1.dt)
        assert.strictEqual(data.d, data1.d)
        assert.notStrictEqual(data.t, data1.t)
        assert.notStrictEqual(data.r, data1.r)
        assert.notStrictEqual(data.riN, data1.riN)

        data1.s.should.equal(2 * i + 1)
        data1.sN.should.equal(2 * i + 1)
        done()
      }, 100)

      function test(_data: Record<string, any>): void {
        _data.ts.should.be.a("number")
        assert(_data.ts <= Date.now())

        ajv.validate({type: "string", format: "date-time"}, _data.dt).should.equal(true)
        new Date(_data.dt).should.be.a("Date")

        ajv.validate({type: "string", format: "date"}, _data.d).should.equal(true)
        new Date().toISOString().indexOf(_data.d).should.equal(0)

        ajv.validate({type: "string", format: "time"}, _data.t).should.equal(true)

        _data.r.should.be.a("number")
        assert(_data.r < 1)
        assert(_data.r >= 0)

        assert(_data.ri === 0 || _data.ri === 1)

        _data.riN.should.be.a("number")
        assert.strictEqual(Math.floor(_data.riN), _data.riN)
        assert(_data.riN < 1000000)
        assert(_data.riN >= 0)

        _data.s.should.be.a("number")

        _data.sN.should.be.a("number")
      }
    })

    it(`should NOT assign default if property is present #${i}`, () => {
      const schema = {
        type: "object",
        dynamicDefaults: {
          ts: "timestamp",
        },
      }

      const validate = ajv.compile(schema)
      const data = {ts: 123}
      validate(data).should.equal(true)
      data.ts.should.equal(123)
    })

    it(`should NOT assign default inside anyOf etc. #${i}`, () => {
      const schema = {
        anyOf: [
          {
            type: "object",
            dynamicDefaults: {
              ts: "timestamp",
            },
          },
          {
            type: "string",
          },
        ],
      }

      const validate = ajv.compile(schema)
      const data: Record<string, any> = {}
      validate(data).should.equal(true)
      should.not.exist(data.ts)
    })

    it(`should fail schema compilation on unknown default #${i}`, () => {
      const schema = {
        type: "object",
        dynamicDefaults: {
          ts: "unknown",
        },
      }

      should.throw(() => {
        ajv.compile(schema)
      })
    })

    it(`should allow adding dynamic default functions #${i}`, () => {
      const schema = {
        type: "object",
        dynamicDefaults: {
          id: "uuid",
        },
        properties: {
          id: {type: "string"},
        },
      }

      should.throw(() => {
        ajv.compile(schema)
      })

      dynamicDefaultsDef.DEFAULTS.uuid = () => uuidv4

      const data: Record<string, any> = {}
      test(data)

      const data1: Record<string, any> = {}
      test(data1)
      assert.notStrictEqual(data.id, data1.id)

      delete dynamicDefaultsDef.DEFAULTS.uuid

      function test(_data: Record<string, any>): void {
        ajv.validate(schema, _data).should.equal(true)
        ajv.validate({format: "uuid", type: "string"}, _data.id).should.equal(true)
        ajv.removeSchema()
      }
    })
  })

  it('should NOT assign defaults when useDefaults is true/"shared and properties are null, empty or contain a value"', () => {
    const schema = {
      type: "object",
      allOf: [
        {
          dynamicDefaults: {
            ts: "datetime",
            r: {func: "randomint", args: {min: 5, max: 100000}},
            id: {func: "seq", args: {name: "id"}},
          },
        },
        {
          type: "object",
          properties: {
            ts: {
              type: "string",
            },
            r: {
              type: "number",
              minimum: 5,
              exclusiveMaximum: 100000,
            },
            id: {
              type: "integer",
              minimum: 0,
            },
          },
        },
      ],
    }

    const data = {
      ts: "",
      r: null,
      id: 3,
    }

    test(new Ajv({useDefaults: true}))

    function test(testAjv: Ajv): void {
      const validate = dynamicDefaults(testAjv).compile(schema)
      validate(data).should.equal(false)

      data.ts.should.equal("")
      should.equal(data.r, null)
      data.id.should.equal(3)
    }
  })

  it('should assign defaults when useDefaults = "empty" for properties that are undefined, null or empty strings', (done) => {
    const schema = {
      type: "object",
      allOf: [
        {
          dynamicDefaults: {
            ts: "datetime",
            r: {func: "randomint", args: {min: 5, max: 100000}},
            id: {func: "seq", args: {name: "id"}},
          },
        },
        {
          type: "object",
          properties: {
            ts: {
              type: "string",
            },
            r: {
              type: "number",
              minimum: 5,
              exclusiveMaximum: 100000,
            },
            id: {
              type: "integer",
              minimum: 0,
            },
          },
        },
      ],
    }

    const data: Record<string, any> = {
      ts: "",
      r: null,
    }

    const data1: Record<string, any> = Object.assign({}, data)

    test(new Ajv({useDefaults: "empty"}))

    function test(testAjv: Ajv): void {
      const validate = dynamicDefaults(testAjv).compile(schema)
      validate(data).should.equal(true)

      const tsRegex = /\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/
      data.ts.should.match(tsRegex)
      data.r.should.be.a("number")
      data.id.should.be.a("number")

      setTimeout(() => {
        validate(data1).should.equal(true)
        data.ts.should.not.equal(data1.ts)
        data1.r.should.be.a("number")
        //data.r and data1.r could match, but unlikely
        data.id.should.not.equal(data1.id)
        done()
      }, 100)
    }
  })
})
