const assign = require('lodash/assign');
const each = require('lodash/each');
const sortBy = require('lodash/sortBy');
const keys = require('lodash/keys');
const instRegistry = require('./instRegistry');
const rawInstsToExecutable = require('./rawInstsToExecutable');
const { getExecutorOptions } = require('./executorOptions');
const outputMessage = require('./outputMessage');
const executions = require('./executions');

const executeAllInstructions = () => {
  const executable = rawInstsToExecutable(instRegistry.getAll());
  const { files, dependencies, commands, directories } = executable;
  each(sortBy(keys(files)), (insts) => {
    each(insts, ({ name, params }) => {
      executions[name](assign(getExecutorOptions(), params));
    });
  });
  each(sortBy(keys(directories)), ({ name, params }) => {
    executions[name](assign(getExecutorOptions(), params));
  });
  each(sortBy(keys(dependencies)), ({ name, params }) => {
    executions[name](assign(getExecutorOptions(), params));
  });
  each(commands, ({ name, params }) => {
    executions[name](assign(getExecutorOptions(), params));
  });
};

module.exports = executeAllInstructions;
