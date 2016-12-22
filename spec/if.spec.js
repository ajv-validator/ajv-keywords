'use strict';

var Ajv = require('ajv');
var defFunc = require('../keywords/if');
var defineKeywords = require('..');
var should = require('chai').should();


describe('keyword "if" - invalid schema', function() {
  var ajvs = [
    defFunc(new Ajv({v5: true})),
    defineKeywords(new Ajv({v5: true}), 'if'),
    defineKeywords(new Ajv({v5: true, allErrors: true}))
  ];

  ajvs.forEach(function (ajv, i) {
    it('should fail schema compilation #' + i, function() {
      should.throw(function() {
        ajv.compile({ if: { maximum: 10 } });
      });
    });
  });
});
