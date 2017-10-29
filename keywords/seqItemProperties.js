'use strict';

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'array',
    validate: function(schema, data) {
      if (data.length > 1) {
        for (var key in schema) {
          var i, values = {};
          for (i = data.length; i--;) {
            if (typeof data[i] != 'object') return false;
            var id = data[i][key];
            if (typeof id != 'number' || (id % 1) || id !== id) return false;
            values[id] = true;
          }
          var init = schema[key];
          for (i = data.length; i--;)
            if (!values[i + init]) return false;
        }
      }
      return true;
    },
    metaSchema: {
      type: 'object',
      additionalProperties: {type: 'integer'}
    }
  };

  ajv.addKeyword('seqItemProperties', defFunc.definition);
  return ajv;
};
