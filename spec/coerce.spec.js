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
    defineKeywords(new Ajv)
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
      data.should.equal('  String  ');
    })
  })

  ajvs.forEach(function (ajv, i) {
    it('should coerce trim #' + i, function () {
      var schema, data

      data = ['  trimObject  '];
      schema = {type: 'array', items: {type: 'string', coerce: ['trimleft']}};
      ajv.validate(schema, data) .should.equal(true);
      data.should.deep.equal(['trimObject  ']);

      data = ['  trimObject  '];
      schema = {type: 'array', items: {type: 'string', coerce: ['trimright']}};
      ajv.validate(schema, data) .should.equal(true);
      data.should.deep.equal(['  trimObject']);

      data = ['  trimObject  '];
      schema = {type: 'array', items: {type: 'string', coerce: ['trimleft','trimright']}};
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

      data = ['ph'];
      schema = {type: 'array', items: {type: 'string', coerce: ['enumcase']}};
      try {
        ajv.validate(schema, data).should.equal(false);
      } catch (e) {
        e.message.should.equal('Missing enum. To use `coerce:["enumcase"]`, `enum:[...]` is required.');
      }

      data = ['ph'];
      schema = {type: 'array', items: {type: 'string', coerce: ['enumcase'], enum:['pH','PH']}};
      try {
        ajv.validate(schema, data).should.equal(false);
      } catch (e) {
        e.message.should.equal('Invalid enum uniqueness. To use `coerce:["enumcase"]`, all values must be unique when case insensitive.');
      }

      data = ['ab'];
      schema = {type: 'array', items: {type: 'string', coerce: ['enumcase'], enum:['pH']}};
      ajv.validate(schema, data) .should.equal(false);
      data.should.deep.equal(['ab']);
    })
  })

})
