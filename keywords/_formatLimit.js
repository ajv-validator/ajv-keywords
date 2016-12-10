'use strict';

module.exports = function (keyword) {
  return function defFunc(ajv) {
    if (ajv.RULES.keywords[keyword])
      return console.warn('Keyword', keyword, 'is already defined');

    defFunc.definition = {
      type: 'string',
      inline: require('./dotjs/_formatLimit'),
      metaSchema: {
        anyOf: [
          { type: 'string' },
          {
            type: 'object',
            required: [ '$data' ],
            properties: {
              $data: {
                type: 'string',
                anyOf: [
                  { format: 'relative-json-pointer' },
                  { format: 'json-pointer' }
                ]
              }
            },
            additionalProperties: false
          }
        ]
      }
    };

    ajv.addKeyword(keyword, defFunc.definition);
  };
};
