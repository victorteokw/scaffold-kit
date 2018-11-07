const assign = require('lodash/assign');
const eachAsync = require('series-async-each');
const sortBy = require('lodash/sortBy');
const keys = require('lodash/keys');
const instRegistry = require('./instRegistry');
const rawInstsToExecutable = require('./rawInstsToExecutable');
const { getExecutorOptions } = require('./executorOptions');
const outputMessage = require('./executions/outputMessage');
const executions = require('./executions');

const executeAllInstructions = async () => {
  const executable = rawInstsToExecutable(instRegistry.getAll());
  const { files, dependencies, commands, directories } = executable;
  await eachAsync(sortBy(keys(files)), async (filename) => {
    await eachAsync(files[filename], async ({ name, params }) => {
      const executionParams = assign(getExecutorOptions(), params);
      const message = await executions[name](executionParams);
      outputMessage(...message);
    });
  });
  await eachAsync(sortBy(keys(directories)), async (directory) => {
    const { name, params } = directories[directory];
    await executions[name](assign(getExecutorOptions(), params));
  });
  await eachAsync(sortBy(keys(dependencies)), async (dependency) => {
    const { name, params } = dependencies[dependency];
    await executions[name](assign(getExecutorOptions(), params));
  });
  await eachAsync(commands, async ({ name, params }) => {
    await executions[name](assign(getExecutorOptions(), params));
  });
};

module.exports = executeAllInstructions;
