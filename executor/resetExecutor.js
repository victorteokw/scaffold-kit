const destinationRegistry = require('./destinationRegistry');
const executorOptions = require('./executorOptions');
const instRegistry = require('./instRegistry');
const templateRegistry = require('./templateRegistry');

const resetExecutor = () => {
  destinationRegistry.reset();
  executorOptions.resetExecutorOptions();
  instRegistry.replaceAll([]);
  templateRegistry.clear();
};

module.exports = resetExecutor;
