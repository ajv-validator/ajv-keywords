'use strict';

var CONSTRUCTORS = {
  Object: Object,
  Array: Array,
  Function: Function,
  Number: Number,
  String: String,
  Date: Date,
  RegExp: RegExp
};

/* istanbul ignore else */
if (typeof Buffer != 'undefined')
  CONSTRUCTORS.Buffer = Buffer;


module.exports = {
  compile: function (schema) {
    var Constructor = CONSTRUCTORS[schema];
    if (typeof schema != 'string' || !Constructor)
      throw new Error('invalid "typeof" keyword value');

    return function (data) {
      return data instanceof Constructor;
    };
  },
  CONSTRUCTORS: CONSTRUCTORS
};
