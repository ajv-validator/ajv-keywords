'use strict';

module.exports = function defFunc (ajv){
  ajv.addKeyword('valueSync', {
    modifying: true,
    valid: true,
    compile: fn => fn,
  });
  return ajv;
};
