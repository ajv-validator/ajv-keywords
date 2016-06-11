'use strict';

var KNOWN_TYPES = ['undefined', 'string', 'number', 'object', 'function', 'boolean', 'symbol'];

module.exports = {
  compile: function (schema) {
    if (typeof schema == 'string') {
      checkType(schema);
      return function (data) {
        return typeof data == schema;
      };
    } else if (Array.isArray(schema)) {
      schema.forEach(checkType);
      return function(data) {
        return schema.indexOf(typeof data) >= 0;
      };
    }
    throw new Error('invalid "typeof" keyword value');

    function checkType(t) {
      if (KNOWN_TYPES.indexOf(t) == -1)
        throw new Error('invalid "typeof" keyword value');
    }
  }
};
