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
    if (typeof schema == 'string') {
      var Constructor = getConstructor(schema);
      return function (data) {
        return data instanceof Constructor;
      };
    } else if (Array.isArray(schema)) {
      var constructors = schema.map(getConstructor);
      return function (data) {
        for (var i=0; i<constructors.length; i++)
          if (data instanceof constructors[i]) return true;
        return false;
      };
    }
    throw new Error('invalid "instanceof" keyword value');
  },
  CONSTRUCTORS: CONSTRUCTORS
};


function getConstructor(c) {
  var Constructor = CONSTRUCTORS[c];
  if (Constructor) return Constructor;
  throw new Error('invalid "instanceof" keyword value');
}
