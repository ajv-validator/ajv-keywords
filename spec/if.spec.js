'use strict';

var Ajv = require('ajv');
var defFunc = require('../keywords/if');
var defineKeywords = require('..');
var should = require('chai').should();


describe('keyword "if"', function() {
  describe('invalid schema', function() {
    var ajvs = [
      defFunc(new Ajv),
      defineKeywords(new Ajv, 'if'),
      defineKeywords(new Ajv({allErrors: true}))
    ];

    ajvs.forEach(function (ajv, i) {
      it('should fail schema compilation #' + i, function() {
        should.throw(function() {
          ajv.compile({ if: { maximum: 10 } });
        });
      });
    });

  });

  it('should work even if switch keyword is not explicitely added', function() {
    var ajv = defFunc(new Ajv);
    var schema = {
      'if': { minimum: 10 },
      'then': { multipleOf: 2 }
    };
    var validate = ajv.compile(schema);
    validate(9) .should.equal(true);
    validate(11) .should.equal(false);
    validate(12) .should.equal(true);
  });
});
