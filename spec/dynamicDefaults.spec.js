'use strict';

var Ajv = require('ajv');
var defFunc = require('../keywords/dynamicDefaults');
var defineKeywords = require('..');
var should = require('chai').should();
var assert = require('assert');
var uuid = require('uuid');

describe('keyword "dynamicDefaults"', function() {
  function getAjv() { return new Ajv({useDefaults: true, unknownFormats: true}); }

  var ajvs = [
    defFunc(getAjv()),
    defineKeywords(getAjv(), 'dynamicDefaults'),
    defineKeywords(getAjv())
  ];

  ajvs.forEach(function (ajv, i) {
    it('should assign defaults #' + i, function (done) {
      var schema = {
        dynamicDefaults: {
          ts: 'timestamp',
          dt: 'datetime',
          d: 'date',
          t: 'time',
          r: 'random',
          ri: 'randomint',
          riN: { func: 'randomint', args: { max: 1000000 } },
          s: 'seq',
          sN: { func: 'seq', args: { name: 'foo' } }
        }
      };

      var validate = ajv.compile(schema);
      var data0 = {};
      validate(data0) .should.equal(true);
      test(data0);
      data0.s .should.equal(2*i);
      data0.sN .should.equal(2*i);

      setTimeout(function() {
        var data1 = {};
        validate(data1) .should.equal(true);
        test(data1);
        assert(data0.ts < data1.ts);
        assert.notEqual(data0.dt, data1.dt);
        assert.equal(data0.d, data1.d);
        assert.notEqual(data0.t, data1.t);
        assert.notEqual(data0.r, data1.r);
        assert.notEqual(data0.riN, data1.riN);

        data1.s .should.equal(2*i + 1);
        data1.sN .should.equal(2*i + 1);
        done();
      }, 1000);

      function test(data) {
        data.ts .should.be.a('number');
        assert(data.ts <= Date.now());

        ajv.validate({type: 'string', format: 'date-time'}, data.dt) .should.equal(true);
        new Date(data.dt) .should.be.a('Date');

        ajv.validate({type: 'string', format: 'date'}, data.d) .should.equal(true);
        (new Date).toISOString().indexOf(data.d) .should.equal(0);

        ajv.validate({type: 'string', format: 'time'}, data.t) .should.equal(true);

        data.r .should.be.a('number');
        assert(data.r < 1);
        assert(data.r >= 0);

        assert(data.ri === 0 || data.ri === 1);

        data.riN .should.be.a('number');
        assert.equal(Math.floor(data.riN), data.riN);
        assert(data.riN < 1000000);
        assert(data.riN >= 0);

        data.s .should.be.a('number');

        data.sN .should.be.a('number');
      }
    });

    it('should NOT assign default if property is present #' + i, function() {
      var schema = {
        dynamicDefaults: {
          ts: 'timestamp'
        }
      };

      var validate = ajv.compile(schema);
      var data = { ts: 123 };
      validate(data) .should.equal(true);
      data.ts .should.equal(123);
    });

    it('should NOT assign default inside anyOf etc. #' + i, function() {
      var schema = {
        anyOf: [
          {
            dynamicDefaults: {
              ts: 'timestamp'
            }
          }
        ]
      };

      var validate = ajv.compile(schema);
      var data = {};
      validate(data) .should.equal(true);
      should.not.exist(data.ts);
    });

    it('should fail schema compilation on unknown default #' + i, function() {
      var schema = {
        dynamicDefaults: {
          ts: 'unknown'
        }
      };

      should.throw(function() {
        ajv.compile(schema);
      });
    });

    it('should allow adding defaults #' + i, function() {
      var schema = {
        dynamicDefaults: {
          id: 'uuid'
        }
      };

      should.throw(function() {
        ajv.compile(schema);
      });

      defFunc.definition.DEFAULTS.uuid = uuidV4;

      var data0 = {};
      test(data0);

      should.throw(function() {
        ajv.compile(schema);
      });

      defineKeywords.get('dynamicDefaults').definition.DEFAULTS.uuid = uuidV4;

      var data1 = {};
      test(data1);
      assert.notEqual(data0.id, data1.id);

      function test(data) {
        ajv.validate(schema, data) .should.equal(true);
        ajv.validate({ format: 'uuid', type: 'string' }, data.id) .should.equal(true);

        delete defFunc.definition.DEFAULTS.uuid;
        ajv.removeSchema();
      }

      function uuidV4() { return uuid.v4(); }
    });
  });

  it('should NOT assign defaults when useDefaults is true/"shared and properties are null, empty or contain a value"', function() {

    var schema = {
      allOf: [
        {
          dynamicDefaults: {
            ts: 'datetime',
            r: { func: 'randomint', args: { min: 5, max: 100000 } },
            id: { func: 'seq', args: { name: 'id' } }
          }
        },
        {
          type: 'object',
          properties: {
            ts: {
              type: 'string'
            },
            r: {
              type: 'number',
              minimum: 5,
              exclusiveMaximum: 100000
            },
            id: {
              type: 'integer',
              minimum: 0
            }
          }
        }
      ]
    };

    var data = {
      ts: '',
      r: null,
      id: 3
    };

    test(new Ajv({useDefaults: true}));
    test(new Ajv({useDefaults: 'shared'}));

    function test(testAjv) {
      var validate = defFunc(testAjv).compile(schema);
      validate(data).should.equal(false);

      data.ts.should.equal('');
      should.equal(data.r, null);
      data.id.should.equal(3);
    }
  });

  it('should assign defaults when useDefaults = "empty" for properties that are undefined, null or empty strings', function(done) {

    var schema = {
      allOf: [
        {
          dynamicDefaults: {
            ts: 'datetime',
            r: { func: 'randomint', args: { min: 5, max: 100000 } },
            id: { func: 'seq', args: { name: 'id' } }
          }
        },
        {
          type: 'object',
          properties: {
            ts: {
              type: 'string'
            },
            r: {
              type: 'number',
              minimum: 5,
              exclusiveMaximum: 100000
            },
            id: {
              type: 'integer',
              minimum: 0
            }
          }
        }
      ]
    };

    var data = {
      ts: '',
      r: null
    };

    var data1 = Object.assign({}, data);

    test(new Ajv({useDefaults: 'empty'}));

    function test(testAjv) {
      var validate = defFunc(testAjv).compile(schema);
      validate(data).should.equal(true);

      var tsRegex = /\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z/;
      data.ts.should.match(tsRegex);
      data.r.should.be.a('number');
      data.id.should.be.a('number');

      setTimeout(function(){
        validate(data1).should.equal(true);
        data.ts.should.not.equal(data1.ts);
        data1.r.should.be.a('number');
        //data.r and data1.r could match, but unlikely
        data.id.should.not.equal(data1.id);
        done();
      }, 1000);
    }
  });
});