'use strict';

var Ajv = require('ajv');
var defFunc = require('../keywords/patternRequired');
var defineKeywords = require('..');
require('chai').should();


describe('keywords "patternRequired"', function() {
  var ajvs = getAjvs();
  var ajvsOP = getAjvs(true);

  ajvs.forEach(function (ajv, i) {
    it('should only validate against own properties when using patternRequired #' + i, function() {
      var ajvOP = ajvsOP[i];
      var schema = { patternRequired: [ 'f.*o' ] };

      var baz = { foooo: false, fooooooo: 42.31 };
      function FooThing() { this.bar = 123; }
      FooThing.prototype = baz;
      var object = new FooThing();

      ajv.validate(schema, object).should.equal(true);
      ajvOP.validate(schema, object).should.equal(false);
      ajvOP.errors.should.have.length(1);
    });
  });

  function getAjv(ownProperties) {
    return new Ajv({ allErrors: true, ownProperties: ownProperties });
  }

  function getAjvs(ownProperties) {
    return [
      defFunc(getAjv(ownProperties)),
      defineKeywords(getAjv(ownProperties), 'patternRequired'),
      defineKeywords(getAjv(ownProperties))
    ];
  }
});
