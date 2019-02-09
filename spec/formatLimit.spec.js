'use strict';

var Ajv = require('ajv');
var defFunc = require('../keywords/formatMaximum');
var defineKeywords = require('..');
var should = require('chai').should();


describe('keywords "formatMinimum" and "formatMaximum"', function() {
  var ajvs = getAjvs(true);
  var ajvsFF = getAjvs(false);

  ajvs.forEach(function (ajv, i) {
    it('should not validate formatMaximum/Minimum if option format == false #' + i, function() {
      var ajvFF = ajvsFF[i];

      var schema = {
        format: 'date',
        formatMaximum: '2015-08-01'
      };

      var date = '2015-09-01';
      ajv.validate(schema, date) .should.equal(false);
      ajvFF.validate(schema, date) .should.equal(true);
    });
  });

  ajvs.forEach(function (ajv, i) {
    it('should throw when "format" is absent #' + i, function() {
      should.throw(function() {
        ajv.compile({ formatMaximum: '2015-08-01' });
      });
    });
  });

  ajvs.forEach(function (ajv, i) {
    it('formatExclusiveMaximum should throw if not boolean #' + i, function() {
      should.throw(function() {
        ajv.compile({ formatMaximum: '2015-08-01', formatExclusiveMaximum: 1 });
      });
    });
  });

  ajvs.forEach(function (ajv, i) {
    it('formatExclusiveMaximum should throw when "formatMaximum" is absent #' + i, function() {
      should.throw(function() {
        ajv.compile({ formatExclusiveMaximum: true });
      });
    });
  });

  function getAjv(format) {
    return new Ajv({ allErrors: true, format: format });
  }

  function getAjvs(format) {
    return [
      defFunc(getAjv(format)),
      defineKeywords(getAjv(format), 'formatMaximum'),
      defineKeywords(getAjv(format))
    ];
  }
});
