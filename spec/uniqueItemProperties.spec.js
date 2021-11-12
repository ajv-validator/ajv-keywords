'use strict';

var Ajv = require('ajv');
var defFunc = require('../keywords/uniqueItemProperties');
var defineKeywords = require('..');

describe('keyword "uniqueItemProperties"', function () {
  var ajvs = [
    defFunc(new Ajv({ $data: true })),
    defineKeywords(new Ajv({ $data: true }), 'uniqueItemProperties'),
    defineKeywords(new Ajv({ $data: true, allErrors: true }))
  ];

  describe('with scalar propery', function () {
    ajvs.forEach(function (ajv, i) {
      it('should return error message with property name #' + i, function () {
        var invalidData = [
          { 'id': 1 },
          { 'id': 1 },
          { 'id': 3 }
        ];
        var validate = ajv.compile({ uniqueItemProperties: ['id'] });

        validate(invalidData).should.equal(false);
        var error = validate.errors[0];

        error.keyword.should.equal('uniqueItemProperties');
        error.params.keyword.should.equal('uniqueItemProperties');
        error.message.should.equal('should have unique id');
      });
    });
  });

  describe('with non scalar propery', function () {
    ajvs.forEach(function (ajv, i) {
      it('should return error message with property name #' + i, function () {
        var invalidData = [
          { 'name': { 'firstName': 'John', 'lastName': 'Doe' } },
          { 'name': { 'firstName': 'John', 'lastName': 'Doe' } },
          { 'name': { 'firstName': 'Lorem', 'lastName': 'Ipsum' } }
        ];
        var validate = ajv.compile({ uniqueItemProperties: ['name'] });

        validate(invalidData).should.equal(false);
        var error = validate.errors[0];

        error.keyword.should.equal('uniqueItemProperties');
        error.params.keyword.should.equal('uniqueItemProperties');
        error.message.should.equal('should have unique name');
      });
    });
  });
});