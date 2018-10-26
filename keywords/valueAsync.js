'use strict';

module.exports = function defFunc (ajv){
  ajv.addKeyword('valueAsync', {
    modifying: true,
    valid: true,
    compile: fn => fn,
  });
  return ajv;
};
