'use strict'

var Ajv = require('ajv')
var ajvPack = require('ajv-pack')
var defFunc = require('../keywords/coerce')
var defineKeywords = require('..')
var should = require('chai').should()

describe('keyword "coerce"', function () {
  var ajvs = [
    defFunc(new Ajv),
    defineKeywords(new Ajv, 'coerce'),
    defineKeywords(new Ajv),
    //defFunc(ajvPack.instance(new Ajv({sourceCode: true})))
  ]


  ajvs.forEach(function (ajv, i) {
    it('should coerce by wrapper #' + i, function () {
      var schema, data

      data = {o: '  Object  '};
      schema = {type: 'object', properties: {o: {type: 'string', coerce: ['trim', 'lowercase']}}};
      ajv.validate(schema, data) .should.equal(true);
      data.should.deep.equal({o:'object'});

      data = ['  Array  '];
      schema = {type: 'array', items: {type: 'string', coerce: ['trim','uppercase']}};
      ajv.validate(schema, data) .should.equal(true);
      data.should.deep.equal(['ARRAY']);


      data = '  String  ';
      schema = {type: 'string', coerce: ['trim', 'lowercase']};
      ajv.validate(schema, data) .should.equal(true);
      // Note: Doesn't work on plain strings due to object being undefined
      // data.should.deep.equal('string');
    })
  })

  ajvs.forEach(function (ajv, i) {
    it('should coerce trim #' + i, function () {
      var schema, data

      data = ['  trimObject  '];
      schema = {type: 'array', items: {type: 'string', coerce: ['trimLeft']}};
      ajv.validate(schema, data) .should.equal(true);
      data.should.deep.equal(['trimObject  ']);

      data = ['  trimObject  '];
      schema = {type: 'array', items: {type: 'string', coerce: ['trimRight']}};
      ajv.validate(schema, data) .should.equal(true);
      data.should.deep.equal(['  trimObject']);

      data = ['  trimObject  '];
      schema = {type: 'array', items: {type: 'string', coerce: ['trimLeft','trimRight']}};
      ajv.validate(schema, data) .should.equal(true);
      data.should.deep.equal(['trimObject']);

      data = ['  trimObject  '];
      schema = {type: 'array', items: {type: 'string', coerce: ['trim']}};
      ajv.validate(schema, data) .should.equal(true);
      data.should.deep.equal(['trimObject']);
    })
  })

  ajvs.forEach(function (ajv, i) {
    it('should coerce text case #' + i, function () {
      var schema, data

      data = ['MixCase'];
      schema = {type: 'array', items: {type: 'string', coerce: ['lowercase']}};
      ajv.validate(schema, data) .should.equal(true);
      data.should.deep.equal(['mixcase']);

      data = ['MixCase'];
      schema = {type: 'array', items: {type: 'string', coerce: ['uppercase']}};
      ajv.validate(schema, data) .should.equal(true);
      data.should.deep.equal(['MIXCASE']);

      data = ['ph', 'PH','pH','Ph'];
      schema = {type: 'array', items: {type: 'string', coerce: ['enumcase'], enum:['pH']}};
      ajv.validate(schema, data) .should.equal(true);
      data.should.deep.equal(['pH','pH','pH','pH']);

      data = ['ab'];
      schema = {type: 'array', items: {type: 'string', coerce: ['enumcase'], enum:['pH']}};
      ajv.validate(schema, data) .should.equal(false);
      data.should.deep.equal(['ab']);
    })
  })

})
