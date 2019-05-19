// Core functions

const getInstructions = require('./getInstructions');
const replaceInstructions = require('./replaceInstructions');
const reverseInstruction = require('./reverseInstruction');
const { setExecutorOption } = require('./executorOptions');
const resetExecutor = require('./resetExecutor');

// Utility functions

const iterateTemplateFilesFromDirectory =
  require('./iterateTemplateFilesFromDirectory');

module.exports = {

  // Core functions

  getInstructions,
  replaceInstructions,
  reverseInstruction,
  setExecutorOption,
  resetExecutor,

  // Utility functions

  iterateTemplateFilesFromDirectory
};
