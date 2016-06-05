'use strict';

var KNOWN_TYPES = ['undefined', 'string', 'number', 'object', 'function', 'boolean', 'symbol'];

module.exports = {
  compile: function (schema) {
    if (typeof schema != 'string' || KNOWN_TYPES.indexOf(schema) == -1)
      throw new Error('invalid "typeof" keyword value');

    return function (data) {
      return typeof data == schema;
    };
  }
};
