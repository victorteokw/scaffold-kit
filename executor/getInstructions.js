const cloneDeep = require('lodash/cloneDeep');

const instRegistry = require('./instRegistry');

const getInstructions = () => {
  return cloneDeep(instRegistry.getAll());
};

module.exports = getInstructions;
