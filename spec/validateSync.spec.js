'use strict';

var Ajv = require('ajv');
var defFunc = require('../keywords/validateSync');
var defineKeywords = require('..');
var should = require('chai').should();

describe('keywords "validateSync"', function() {
  var ajvs = [
    defFunc(getAjv()),
    defineKeywords(getAjv(), 'validateSync')
  ];

  ajvs.forEach(function (ajv, i) {
    it('should use validateSync function #' + i, function() {

      var schema = {
        type: 'number',
        validateSync: function (data) {
          return data === 1;
        }
      };

      var validData = 1;

      var inValidData = 2;

      ajv.validate(schema, validData).should.equal(true);
      ajv.validate(schema, inValidData).should.equal(false);
    });
  });

  function getAjv(format) {
    return new Ajv({ allErrors: true });
  }
});
