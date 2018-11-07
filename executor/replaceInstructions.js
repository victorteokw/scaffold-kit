const instRegistry = require('./instRegistry');

const replaceInstructions = (insts) => {
  instRegistry.replaceAll(insts);
};

module.exports = replaceInstructions;
