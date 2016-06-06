'use strict';

var Ajv = require('ajv');
var definition = require('../keywords/instanceof');
var defineKeywords = require('..');
var should = require('chai').should();


describe('keyword "instanceof"', function() {
  var ajvs = [ new Ajv, new Ajv ];
  ajvs[0].addKeyword('instanceof', definition);
  defineKeywords(ajvs[1], 'instanceof');

  ajvs.forEach(function (ajv, i) {
    it('should validate classes #' + i, function() {
      ajv.validate({ instanceof: 'Object' }, {}) .should.equal(true);
      ajv.validate({ instanceof: 'Object' }, []) .should.equal(true);
      ajv.validate({ instanceof: 'Object' }, 'foo') .should.equal(false);
      ajv.validate({ instanceof: 'Array' }, {}) .should.equal(false);
      ajv.validate({ instanceof: 'Array' }, []) .should.equal(true);
      ajv.validate({ instanceof: 'Array' }, 'foo') .should.equal(false);
      ajv.validate({ instanceof: 'Function' }, function(){}) .should.equal(true);
      ajv.validate({ instanceof: 'Function' }, []) .should.equal(false);
      ajv.validate({ instanceof: 'Number' }, new Number(42)) .should.equal(true);
      ajv.validate({ instanceof: 'Number' }, 42) .should.equal(false);
      ajv.validate({ instanceof: 'Number' }, 'foo') .should.equal(false);
      ajv.validate({ instanceof: 'String' }, new String('foo')) .should.equal(true);
      ajv.validate({ instanceof: 'String' }, 'foo') .should.equal(false);
      ajv.validate({ instanceof: 'String' }, 42) .should.equal(false);
      ajv.validate({ instanceof: 'Date' }, new Date) .should.equal(true);
      ajv.validate({ instanceof: 'Date' }, {}) .should.equal(false);
      ajv.validate({ instanceof: 'RegExp' }, /.*/) .should.equal(true);
      ajv.validate({ instanceof: 'RegExp' }, {}) .should.equal(false);
      ajv.validate({ instanceof: 'Buffer' }, new Buffer('foo')) .should.equal(true);
      ajv.validate({ instanceof: 'Buffer' }, 'foo') .should.equal(false);
      ajv.validate({ instanceof: 'Buffer' }, {}) .should.equal(false);
    });
  });

  ajvs.forEach(function (ajv, i) {
    it('should allow adding classes #' + i, function() {
      function MyClass() {}

      should.throw(function() {
        ajv.compile({ instanceof: 'MyClass' });
      });

      definition.CONSTRUCTORS.MyClass = MyClass;

      ajv.validate({ instanceof: 'MyClass' }, new MyClass) .should.equal(true);
      ajv.validate({ instanceof: 'Object' }, new MyClass) .should.equal(true);
      ajv.validate({ instanceof: 'MyClass' }, {}) .should.equal(false);

      delete definition.CONSTRUCTORS.MyClass;
      ajv.removeSchema();

      should.throw(function() {
        ajv.compile({ instanceof: 'MyClass' });
      });

      defineKeywords.get('instanceof').CONSTRUCTORS.MyClass = MyClass;

      ajv.validate({ instanceof: 'MyClass' }, new MyClass) .should.equal(true);
      ajv.validate({ instanceof: 'Object' }, new MyClass) .should.equal(true);
      ajv.validate({ instanceof: 'MyClass' }, {}) .should.equal(false);

      delete definition.CONSTRUCTORS.MyClass;
      ajv.removeSchema();
    });
  });
});
