const map = require('lodash/map');
const compact = require('lodash/compact');

const instRegistry = require('./instRegistry');

const editInstructions = (func) => {
  instRegistry.replaceAll(compact(map(instRegistry.getAll(), func)));
};

module.exports = editInstructions;
