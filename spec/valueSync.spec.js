'use strict';

var Ajv = require('ajv');
var defFunc = require('../keywords/valueSync');
var defineKeywords = require('..');
var should = require('chai').should();

describe('keywords "valueSync"', function() {
  var ajvs = [
    defFunc(getAjv()),
    defineKeywords(getAjv(), 'valueSync')
  ];

  ajvs.forEach(function (ajv, i) {
    it('should use valueSync if field is available function #' + i, function() {

      var schema = {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            valueSync: function (data, currentPath, parentData, propName, root) {
              parentData[propName] = 3;
            }
          }
        }
      };

      var filledData = {id: 1};

      ajv.validate(schema, filledData);
      filledData.should.have.property('id').equal(3);
    });

    it('shouldn\'t use valueSync if field is missing and no default function #' + i, function() {

      var schema = {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            valueSync: function (data, currentPath, parentData, propName, root) {
              parentData[propName] = 3;
            }
          }
        }
      };

      var emptyData = {};

      ajv.validate(schema, emptyData);
      emptyData.should.not.have.property('id');
    });


    it('should use valueSync if default keyword is available function #' + i, function() {

      var schema = {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            default: 4,
            valueSync: function (data, currentPath, parentData, propName, root) {
              parentData[propName] = 3;
            }
          }
        }
      };

      var emptyData = {};

      ajv.validate(schema, emptyData);
      emptyData.should.have.property('id').equal(3);
    });
  });

  function getAjv(format) {
    return new Ajv({ allErrors: true, useDefaults: true });
  }
});
