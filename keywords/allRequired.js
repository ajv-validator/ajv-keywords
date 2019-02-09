'use strict';

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'object',
    macro: function (schema, parentSchema) {
      if (!schema) return {};
      var properties = Object.keys(parentSchema.properties || {});
      if (properties.length == 0) return {};
      return { required: properties };
    },
    metaSchema: {
      type: 'boolean'
    }
  };

  ajv.addKeyword('allRequired', defFunc.definition);
  return ajv;
};
