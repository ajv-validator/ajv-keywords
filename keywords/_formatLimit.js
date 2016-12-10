'use strict';

module.exports = function (minMax) {
  var keyword = 'format' + minMax;
  return function defFunc(ajv) {
    if (ajv.RULES.keywords[keyword])
      return console.warn('Keyword', keyword, 'is already defined');

    defFunc.definition = {
      type: 'string',
      inline: require('./dotjs/_formatLimit'),
      statements: true,
      errors: 'full',
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
    ajv.addKeyword('formatExclusive' + minMax);
    return ajv;
  };
};
