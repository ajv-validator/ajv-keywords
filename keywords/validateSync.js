'use strict';

module.exports = function defFunc (ajv){
  ajv.addKeyword('validateSync', {
    validate: (fn, data) => fn(data),
  });
  return ajv;
};
