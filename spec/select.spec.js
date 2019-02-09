'use strict';

var Ajv = require('ajv');
var defFunc = require('../keywords/select');
var defineKeywords = require('..');
var should = require('chai').should();


describe('keyword "select"', function() {
  describe('invalid schema', function() {
    var ajvs = [
      defFunc(new Ajv({$data: true})),
      defineKeywords(new Ajv({$data: true}), 'select'),
      defineKeywords(new Ajv({$data: true, allErrors: true}))
    ];

    ajvs.forEach(function (ajv, i) {
      it('should throw during validation #' + i, function() {
        var validate = ajv.compile({
          select: { $data: '0/type' }
        });

        should.throw(function() {
          validate({type: 'foo'});
        });
      });

      it('should NOT throw during validation #' + i, function() {
        var validate = ajv.compile({
          select: { $data: '0/type' },
          selectCases: {
            foo: true,
            bar: true
          },
          selectDefault: false
        });

        validate({type: 'foo'}) .should.equal(true);
        validate({type: 'bar'}) .should.equal(true);
        validate({type: 'unknown'}) .should.equal(false);
        validate({}) .should.equal(true);
      });
    });

  });
});
