'use strict';

var Ajv = require('ajv');
var defFunc = require('../keywords/validateAsync');
var defineKeywords = require('..');
var should = require('chai').should();

describe('keywords "validateAsync"', function() {
  var ajvs = [
    defFunc(getAjv()),
    defineKeywords(getAjv(), 'validateAsync')
  ];

  ajvs.forEach(function (ajv, i) {
    it('should use validateAsync function #' + i, function() {

      var schema = {
        $async: true,
        type: 'number',
        validateAsync: function (data) {
          return Promise.resolve(data === 1);
        }
      };

      var validData = 1;

      var inValidData = 2;

      return Promise.all([
        ajv.validate(schema, validData).then(validData=>{
          validData.should.equal(1);
        }),
        ajv.validate(schema, inValidData).catch(err=>{
          err.errors[0].keyword.should.equal('validateAsync');
        })
      ]);
    });
  });

  function getAjv(format) {
    return new Ajv({ allErrors: true });
  }
});
