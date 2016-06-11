'use strict';

module.exports = {
  type: 'number',
  macro: function (schema, parentSchema) {
    var min = schema[0]
      , max = schema[1]
      , exclusive = parentSchema.exclusiveRange;

    validateRangeSchema(schema, min, max, exclusive);

    return {
      minimum: schema[0],
      exclusiveMinimum: exclusive,
      maximum: schema[1],
      exclusiveMaximum: exclusive
    };
  }
};


function validateRangeSchema(schema, min, max, exclusive) {
  if (!Array.isArray(schema) || schema.length != 2 || typeof min != 'number' || typeof max != 'number')
    throw new Error('Invalid schema for range keyword, should be array of 2 numbers');

  if (exclusive !== undefined && typeof exclusive != 'boolean')
    throw new Error('Invalid schema for exclusiveRange keyword, should be bolean');

  if (schema[0] > schema[1] || (exclusive && schema[0] == schema[1]))
    throw new Error('There are no numbers in range');
}
