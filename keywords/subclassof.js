'use strict';

module.exports = function defFunc(ajv, customConstructors, overrideBuffer = false) {
  var CONSTRUCTORS = {
    Object: Object,
    Array: Array,
    Function: Function,
    Number: Number,
    String: String,
    Date: Date,
    RegExp: RegExp,
    Error: Error
  };

  /* istanbul ignore else */
  if(typeof Promise !== 'undefined')
    addCustomConstructor(CONSTRUCTORS, 'Promise', Promise);

  if (arguments.length > 1) {
    if(typeof customConstructors !== 'object') {
      throw new Error(
        'second argument \'customConstructors\' should be an object with <string, function> key-value pairs'
      );
    }
    Object.keys(customConstructors).forEach(function(key) {
      if(key === 'Buffer' && !overrideBuffer) {
        throw new Error(
          'Buffer is not a subclassable class in ES6. See https://stackoverflow.com/questions/44909648'
        );
      }
      addCustomConstructor(CONSTRUCTORS, key, customConstructors[key]);
    });
  }

  var definition = {
    compile: function (schema) {
      if (typeof schema == 'string') {
        var Constructor = getConstructor(schema);
        return function (data) {
          return data.prototype instanceof Constructor ||
            (data.constructor.prototype instanceof Constructor && data !== Object);
        };
      }

      var constructors = schema.map(getConstructor);
      return function (data) {
        for (var i=0; i<constructors.length; i++){
          if (data.prototype instanceof constructors[i] ||
            (data.constructor.prototype instanceof constructors[i] && data !== Object))
            return true;
        }
        return false;
      };
    },
    CONSTRUCTORS: CONSTRUCTORS,
    metaSchema: {
      anyOf: [
        { type: 'string' },
        {
          type: 'array',
          items: { type: 'string' }
        }
      ]
    }
  };

  ajv.addKeyword('subclassof', definition);

  function getConstructor(c) {
    var Constructor = CONSTRUCTORS[c];
    if (Constructor) return Constructor;
    throw new Error('invalid "subclassof" keyword value ' + c);
  }
  return ajv;
};

function addCustomConstructor(constructors, name, constructorFunc) {
  /* istanbul ignore else */
  if (typeof constructorFunc !== 'function')
    throw new Error('custom constructors must be functions');
  constructors[name] = constructorFunc;
}
