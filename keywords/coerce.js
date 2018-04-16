'use strict';

module.exports = function defFunc (ajv) {
  defFunc.definition = {
    type: 'string',
    errors: false,
    modifying: true,
    schema: false,
    valid: true,
    compile: function (schema, parentSchema) {

      // build hash table to enum values
      var hashtable = {};

      if (schema.indexOf('enumcase') !== -1) {
        // requires `enum` in schema
        if (!parentSchema.enum)
          throw new Error('Missing enum. To use `coerce:["enumcase"]`, `enum:[...]` is required.');
        for (var i = parentSchema.enum.length; i--; i) {
          var v = parentSchema.enum[i];
          var k = makeHashTableKey(v);
          // requires all `enum` values have unique keys
          if (hashtable[k])
            throw new Error('Invalid enum uniqueness. To use `coerce:["enumcase"]`, all values must be unique when case insensitive.');
          hashtable[k] = v;
        }
      }

      var coerce = {
        trimLeft: function (value) {
          return value.replace(/^[\s]+/, '');
        },
        trimRight: function (value) {
          return value.replace(/[\s]+$/, '');
        },
        trim: function (value) {
          return value.trim();
        },
        lowercase: function (value) {
          return value.toLowerCase();
        },
        uppercase: function (value) {
          return value.toUpperCase();
        },
        enumcase: function (value) {
          return hashtable[makeHashTableKey(value)] || value;
        }
      };

      return function (value, objectKey, object, key) {
        // skip if value only
        if (!object) return;

        // apply coerce in order provided
        for (var j = 0, l = schema.length; j < l; j++)
          object[key] = coerce[schema[j]](object[key]);
      };
    },
    metaSchema: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'trimLeft', 'trimRight', 'trim',
          'lowercase', 'uppercase', 'enumcase'
        ]
      }
    }
  };

  ajv.addKeyword('coerce', defFunc.definition);
  return ajv;

  function makeHashTableKey (value) {
    return value.toLowerCase();
  }
};
