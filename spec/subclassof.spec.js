'use strict';

var Ajv = require('ajv');
var defFunc = require('../keywords/subclassof');
var should = require('chai').should();


describe('keyword "subclassof"', function() {
  function makeChildClass(superclass) {
    return class ChildClass extends superclass {};
  }

  function makeGrandChildClass(superclass) {
    class ChildClass extends superclass {};
    return class GrandChildClass extends ChildClass {};
  }

  var BUILTINS = {
    Object: Object,
    Array: Array,
    Function: Function,
    Number: Number,
    String: String,
    Date: Date,
    RegExp: RegExp,
    Error: Error,
    Promise: Promise,
  };

  var BUILTIN_INSTANCES = {
    Object: {},
    Array: [],
    Function: function(){},
    Number: 42,
    String: 'foo',
    Date: new Date(),
    RegExp: /foo/,
    Error: new Error('foo'),
    Promise: Promise.resolve(42),
  };

  var CONSTRUCTED_BUILTIN_INSTANCES = {
    Object: new Object(),
    Array: new Array(0),
    Function: new Function(),
    Number: new Number(42),
    String: new String('foo'),
    Date: new Date(),
    RegExp: new RegExp(/foo/),
    Error: new Error('foo'),
    Promise: new Promise(function(resolve) { resolve(42); }),
  };

  it('should fail if customConstructors is not an object', function() {
    should.throw(defFunc.bind(null, new Ajv(), () => {}));
  });

  it('should fail if custom constructors in customConstructors are not functions', function() {
    should.throw(defFunc.bind(null, new Ajv(), { MyClass: 'MyClass' }));
  });

  it('should validate classes', function() {
    var ajv = defFunc(new Ajv());
    Object.keys(BUILTINS).forEach(function(name) {
      var ChildClass = makeChildClass(BUILTINS[name]);
      var GrandChildClass = makeGrandChildClass(BUILTINS[name]);
      var childInstance = name === 'Promise' ? new ChildClass(() => {}) : new ChildClass();
      var grandChildInstance = name === 'Promise' ? new GrandChildClass(() => {}) : new GrandChildClass();
      ajv.validate({ subclassof: name }, ChildClass).should.equal(true);
      ajv.validate({ subclassof: name }, GrandChildClass).should.equal(true);
      ajv.validate({ subclassof: name }, childInstance).should.equal(true);
      ajv.validate({ subclassof: name }, grandChildInstance).should.equal(true);
      ajv.validate({ subclassof: name }, BUILTINS[name]).should.equal(false);
      ajv.validate({ subclassof: name }, BUILTIN_INSTANCES[name]).should.equal(false);
      ajv.validate({ subclassof: name }, CONSTRUCTED_BUILTIN_INSTANCES[name]).should.equal(false);
    });
  });

  it('should validate multiple classes', function() {
    var ajv = defFunc(new Ajv());
    var subclassof = ['Array', 'Function'];
    subclassof.forEach(function(name) {
      var ChildClass = makeChildClass(BUILTINS[name]);
      var GrandChildClass = makeGrandChildClass(BUILTINS[name]);
      var childInstance = name === 'Promise' ? new ChildClass(() => {}) : new ChildClass();
      var grandChildInstance = name === 'Promise' ? new GrandChildClass(() => {}) : new GrandChildClass();
      ajv.validate({ subclassof: subclassof }, ChildClass).should.equal(true);
      ajv.validate({ subclassof: subclassof }, GrandChildClass).should.equal(true);
      ajv.validate({ subclassof: subclassof }, childInstance).should.equal(true);
      ajv.validate({ subclassof: subclassof }, grandChildInstance).should.equal(true);
      ajv.validate({ subclassof: subclassof }, BUILTINS[name]).should.equal(false);
      ajv.validate({ subclassof: subclassof }, BUILTIN_INSTANCES[name]).should.equal(false);
      ajv.validate({ subclassof: subclassof }, CONSTRUCTED_BUILTIN_INSTANCES[name]).should.equal(false);
    });
  });

  it('should fail to compile if a custom class name is passed without prior knowledge of the constructor', function() {
    var ajv = defFunc(new Ajv());
    should.throw(ajv.compile.bind(ajv, { subclassof: 'ParentClass' }));
  });

  it('should fail if Buffer is passed for subclassing', function() {
    should.throw(defFunc.bind(null, new Ajv(), { Buffer: Buffer }));
  });

  it('should pass if Buffer is passed for subclassing and overrideBuffer parameter is truthy', function() {
    should.not.throw(defFunc.bind(null, new Ajv(), { Buffer: Buffer }, true));
  });

  it('should allow adding classes', function() {
    class ParentClass {}
    class SomeClass {}
    var name = 'ParentClass';
    var ajv = defFunc(new Ajv(), { ParentClass: ParentClass });
    var ChildClass = makeChildClass(ParentClass);
    var GrandChildClass = makeGrandChildClass(ParentClass);
    ajv.validate({ subclassof: name }, ChildClass).should.equal(true);
    ajv.validate({ subclassof: name }, GrandChildClass).should.equal(true);
    ajv.validate({ subclassof: name }, new ChildClass()).should.equal(true);
    ajv.validate({ subclassof: name }, new GrandChildClass()).should.equal(true);
    ajv.validate({ subclassof: 'Object' }, new ParentClass()).should.equal(true);
    ajv.validate({ subclassof: 'Object' }, ParentClass).should.equal(true);
    ajv.validate({ subclassof: name }, ParentClass).should.equal(false);
    ajv.validate({ subclassof: name }, new ParentClass()).should.equal(false);
  });

  it('should throw when not string or array is passed', function() {
    var ajv = defFunc(new Ajv(), { ParentClass: class ParentClass {} });
    should.throw(ajv.compile.bind(ajv, { subclassof: 1 }));
  });
});
