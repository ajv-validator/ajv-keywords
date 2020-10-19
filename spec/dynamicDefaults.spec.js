"use strict"

const Ajv = require("ajv")
const defFunc = require("../dist/keywords/dynamicDefaults")
const defineKeywords = require("../dist")
const should = require("chai").should()
const assert = require("assert")
const uuid = require("uuid")

describe('keyword "dynamicDefaults"', () => {
  function getAjv() {
    return new Ajv({useDefaults: true, unknownFormats: true})
  }

  const ajvs = [
    defFunc(getAjv()),
    defineKeywords(getAjv(), "dynamicDefaults"),
    defineKeywords(getAjv()),
  ]

  ajvs.forEach((ajv, i) => {
    it("should assign defaults #" + i, (done) => {
      const schema = {
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
      const data = {}
      validate(data).should.equal(true)
      test(data)
      data.s.should.equal(2 * i)
      data.sN.should.equal(2 * i)

      setTimeout(() => {
        const data1 = {}
        validate(data1).should.equal(true)
        test(data1)
        assert(data.ts < data1.ts)
        assert.notEqual(data.dt, data1.dt)
        assert.equal(data.d, data1.d)
        assert.notEqual(data.t, data1.t)
        assert.notEqual(data.r, data1.r)
        assert.notEqual(data.riN, data1.riN)

        data1.s.should.equal(2 * i + 1)
        data1.sN.should.equal(2 * i + 1)
        done()
      }, 1000)

      function test(_data) {
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
        assert.equal(Math.floor(_data.riN), _data.riN)
        assert(_data.riN < 1000000)
        assert(_data.riN >= 0)

        _data.s.should.be.a("number")

        _data.sN.should.be.a("number")
      }
    })

    it("should NOT assign default if property is present #" + i, () => {
      const schema = {
        dynamicDefaults: {
          ts: "timestamp",
        },
      }

      const validate = ajv.compile(schema)
      const data = {ts: 123}
      validate(data).should.equal(true)
      data.ts.should.equal(123)
    })

    it("should NOT assign default inside anyOf etc. #" + i, () => {
      const schema = {
        anyOf: [
          {
            dynamicDefaults: {
              ts: "timestamp",
            },
          },
        ],
      }

      const validate = ajv.compile(schema)
      const data = {}
      validate(data).should.equal(true)
      should.not.exist(data.ts)
    })

    it("should fail schema compilation on unknown default #" + i, () => {
      const schema = {
        dynamicDefaults: {
          ts: "unknown",
        },
      }

      should.throw(() => {
        ajv.compile(schema)
      })
    })

    it("should allow adding defaults #" + i, () => {
      const schema = {
        dynamicDefaults: {
          id: "uuid",
        },
      }

      should.throw(() => {
        ajv.compile(schema)
      })

      defFunc.definition.DEFAULTS.uuid = uuidV4

      const data = {}
      test(data)

      should.throw(() => {
        ajv.compile(schema)
      })

      defineKeywords.get("dynamicDefaults").definition.DEFAULTS.uuid = uuidV4

      const data1 = {}
      test(data1)
      assert.notEqual(data.id, data1.id)

      function test(_data) {
        ajv.validate(schema, _data).should.equal(true)
        ajv.validate({format: "uuid", type: "string"}, _data.id).should.equal(true)

        delete defFunc.definition.DEFAULTS.uuid
        ajv.removeSchema()
      }

      function uuidV4() {
        return uuid.v4()
      }
    })
  })

  it('should NOT assign defaults when useDefaults is true/"shared and properties are null, empty or contain a value"', () => {
    const schema = {
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
    test(new Ajv({useDefaults: "shared"}))

    function test(testAjv) {
      const validate = defFunc(testAjv).compile(schema)
      validate(data).should.equal(false)

      data.ts.should.equal("")
      should.equal(data.r, null)
      data.id.should.equal(3)
    }
  })

  it('should assign defaults when useDefaults = "empty" for properties that are undefined, null or empty strings', (done) => {
    const schema = {
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
    }

    const data1 = Object.assign({}, data)

    test(new Ajv({useDefaults: "empty"}))

    function test(testAjv) {
      const validate = defFunc(testAjv).compile(schema)
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
      }, 1000)
    }
  })
})
