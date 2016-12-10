'use strict';

module.exports = {
  'instanceof': require('./instanceof'),
  propertyNames: require('./propertyNames'),
  range: require('./range'),
  regexp: require('./regexp'),
  'typeof': require('./typeof'),
  dynamicDefaults: require('./dynamicDefaults'),
  formatMinimum: require('./_formatLimit')('formatMinimum'),
  formatMaximum: require('./_formatLimit')('formatMaximum'),
  patternRequired: require('./patternRequired'),
  'switch': require('./switch')
};
