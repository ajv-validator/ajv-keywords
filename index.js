'use strict';

var KEYWORDS = require('./keywords');

module.exports = defineKeywords;


/**
 * Defines one or several keywords in ajv instance
 * @param  {Ajv} ajv validator instance
 * @param  {String|Array<String>} keyword keyword(s) to define
 */
function defineKeywords(ajv, keyword) {
  if (Array.isArray(keyword)) {
    for (var i=0; i<keyword.length; i++)
      ajv.addKeyword(keyword[i], get(keyword[i]));
    return;
  }
  ajv.addKeyword(keyword, get(keyword));
}


defineKeywords.get = get;


function get(keyword) {
  var def = KEYWORDS[keyword];
  if (!def) throw new Error('Unknown keyword ' + keyword);
  return def;
}
