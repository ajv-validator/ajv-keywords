'use strict';

module.exports = defFunc;

var KNOWN_TYPES = ['undefined', 'string', 'number', 'object', 'function', 'boolean', 'symbol'];

var definition = defFunc.definition = {
  compile: function (schema) {
    return typeof schema == 'string' ? singleType : multipleTypes;

    function singleType(data) {
      return typeof data == schema;
    }

    function multipleTypes(data) {
      return schema.indexOf(typeof data) >= 0;
    }
  },
  metaSchema: {
    anyOf: [
      {
        type: 'string',
        enum: KNOWN_TYPES
      },
      {
        type: 'array',
        items: {
          type: 'string',
          enum: KNOWN_TYPES
        }
      }
    ]
  }
};

function defFunc(ajv) {
  ajv.addKeyword('typeof', definition);
}
