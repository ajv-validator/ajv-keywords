'use strict';

var Ajv = require('ajv');
var ajvPack = require('ajv-pack');
var defFunc = require('../keywords/allRequired');
var defineKeywords = require('..');
var should = require('chai').should();


describe('keyword "allRequired"', function() {
  var ajvs = [
    defFunc(new Ajv),
    defineKeywords(new Ajv, 'allRequired'),
    defineKeywords(new Ajv),
    defFunc(ajvPack.instance(new Ajv({sourceCode: true})))
  ];

  ajvs.forEach(function (ajv, i) {
    it('should validate that all defined properties are present #' + i, function() {
      var schema = {
        properties: {
          foo: true,
          bar: true
        },
        allRequired: true
      };
      ajv.validate(schema, {foo: 1, bar: 2}) .should.equal(true);
      ajv.validate(schema, {foo: 1}) .should.equal(false);
    });
  });

  ajvs.forEach(function (ajv, i) {
    it('should throw when properties is absent #' + i, function() {
      should.throw(function() {
        ajv.compile({ allRequired: true });
      });
    });
  });

  ajvs.forEach(function (ajv, i) {
    it('should throw when allRequired schema is invalid #' + i, function() {
      should.throw(function() {
        ajv.compile({ properties: {foo: true}, allRequired: 1 });
      });
    });
  });
});
