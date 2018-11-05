const assign = require('lodash/assign');
const each = require('lodash/each');
const eachAsync = require('series-async-each');
const sortBy = require('lodash/sortBy');
const keys = require('lodash/keys');
const instRegistry = require('./instRegistry');
const rawInstsToExecutable = require('./rawInstsToExecutable');
const { getExecutorOptions } = require('./executorOptions');
const outputMessage = require('./outputMessage');
const executions = require('./executions');

const executeAllInstructions = async () => {
  const executable = rawInstsToExecutable(instRegistry.getAll());
  const { files, dependencies, commands, directories } = executable;
  await eachAsync(sortBy(keys(files)), async (insts) => {
    await eachAsync(insts, async ({ name, params }) => {
      const executionParams = assign(getExecutorOptions(), params);
      const messages = await executions[name](executionParams);
      each(messages, (message) => {
        outputMessage(...message);
      });
    });
  });
  await eachAsync(sortBy(keys(directories)), async ({ name, params }) => {
    await executions[name](assign(getExecutorOptions(), params));
  });
  await eachAsync(sortBy(keys(dependencies)), async ({ name, params }) => {
    await executions[name](assign(getExecutorOptions(), params));
  });
  await eachAsync(commands, async ({ name, params }) => {
    await executions[name](assign(getExecutorOptions(), params));
  });
};

module.exports = executeAllInstructions;
