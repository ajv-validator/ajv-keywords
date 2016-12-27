'use strict';

module.exports = function defFunc(ajv) {
  if (ajv.RULES.keywords.switch && ajv.RULES.keywords.if) return;

  var metaSchemaUri = 'http://json-schema.org/draft-06/schema#';

  defFunc.definition = {
    inline: require('./dotjs/switch'),
    statements: true,
    errors: 'full',
    metaSchema: {
      type: 'array',
      items: {
        required: [ 'then' ],
        properties: {
          'if': { $ref: metaSchemaUri },
          'then': {
            anyOf: [
              { type: 'boolean' },
              { $ref: metaSchemaUri }
            ]
          },
          'continue': { type: 'boolean' }
        },
        additionalProperties: false,
        dependencies: {
          'continue': [ 'if' ]
        }
      }
    }
  };

  ajv.addKeyword('switch', defFunc.definition);
  return ajv;
};
