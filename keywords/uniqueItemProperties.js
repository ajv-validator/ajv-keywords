'use strict';

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'array',
    compile: function(keys, parentSchema, it) {
      var equal = it.util.equal;
      return function(data) {
        var keyData = keys.reduce(function (props, key) {
          props[key] = [];
          return props;
        }, {});

        var foundCollision = !!data.find(function (item) {
          return !!keys.find(function (key) {
            var value = item[key];
            var foundValue = keyData[key].find(function (storedValue) {
              return equal(value, storedValue);
            });
            if (!foundValue) {
              keyData[key].push(value);
              return false;
            }
            return true;
          });
        });

        return !foundCollision;
      };
    },
    metaSchema: {
      type: 'array'
    }
  };

  ajv.addKeyword('uniqueItemProperties', defFunc.definition);
  return ajv;
};
