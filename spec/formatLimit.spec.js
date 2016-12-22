'use strict';

var Ajv = require('ajv');
var defFunc = require('../keywords/formatMaximum');
var defineKeywords = require('..');
var should = require('chai').should();


describe('keywords "formatMinimum" and "formatMaximum"', function() {
  var ajvs = getAjvs();
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
