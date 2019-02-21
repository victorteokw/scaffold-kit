const eachAsync = require('series-async-each');
const error = require('../error');
const loadCommand = require('./loadCommand');

/**
 * Execute a command.
 *
 * @param {Application} app - The scaffold app.
 * @param {Command} command - The command to be executed.
 * @param {ExecutionInformation} executionParams - The execution parameters.
 * @return {Void} This function returns nothing.
 */
const executeCommand = async (app, command, executionParams) => {

  if (command.composedOf) {
    await eachAsync(command.composedOf, async (subcommandName) => {
      const subcommand = loadCommand(app, subcommandName);
      await executeCommand(
        app,
        subcommand,
        Object.assign(executionParams, command.composingParams)
      );
    });
  } else {
    await command.execute(executionParams);
  }
};

module.exports = executeCommand;
