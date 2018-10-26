'use strict';

module.exports = function defFunc (ajv){
  ajv.addKeyword('validateAsync', {
    async: true,
    validate: (fn, data) => fn(data),
  });
  return ajv;
};
