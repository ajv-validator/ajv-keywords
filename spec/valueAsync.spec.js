'use strict';

var Ajv = require('ajv');
var defFunc = require('../keywords/valueAsync');
var defineKeywords = require('..');
var should = require('chai').should();

describe('keywords "valueAsync"', function() {
  var ajvs = [
    defFunc(getAjv()),
    defineKeywords(getAjv(), 'valueAsync')
  ];

  ajvs.forEach(function (ajv, i) {
    it('should use valueAsync if field is available function #' + i, function() {

      var schema = {
        $async: true,
        type: 'object',
        properties: {
          id: {
            type: 'number',
            valueAsync: function (data, currentPath, parentData, propName, root) {
              Promise.resolve().then(()=>{
                parentData[propName] = 3;
              });
            }
          }
        }
      };

      var filledData = {id: 1};

      return Promise.all([
        ajv.validate(schema, filledData)
        .then(manipulatedData=>{
          manipulatedData.should.have.property('id').equal(3);
        }),
      ]);
    });

    it('shouldn\'t use valueAsync if field is missing and no default function #' + i, function() {

      var schema = {
        $async: true,
        type: 'object',
        properties: {
          id: {
            type: 'number',
            valueAsync: function (data, currentPath, parentData, propName, root) {
              Promise.resolve().then(()=>{
                parentData[propName] = 3;
              });
            }
          }
        }
      };

      var emptyData = {};

      return Promise.all([
        ajv.validate(schema, emptyData)
        .then(manipulatedData=>{
          manipulatedData.should.not.have.property('id');
        }),
      ]);
    });


    it('should use valueAsync if default keyword is available function #' + i, function() {

      var schema = {
        $async: true,
        type: 'object',
        properties: {
          id: {
            type: 'number',
            default: 4,
            valueAsync: function (data, currentPath, parentData, propName, root) {
              Promise.resolve().then(()=>{
                parentData[propName] = 3;
              });
            }
          }
        }
      };

      var emptyData = {};

      return Promise.all([
        ajv.validate(schema, emptyData)
            .then(manipulatedData=>{
              manipulatedData.should.have.property('id').equal(3);
            }),
      ]);
    });
  });

  function getAjv(format) {
    return new Ajv({ allErrors: true, useDefaults: true });
  }
});
