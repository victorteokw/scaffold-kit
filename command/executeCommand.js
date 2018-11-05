const eachAsync = require('series-async-each');
const error = require('../error');
const loadCommand = require('./loadCommand');

/**
 * Execute a command.
 *
 * @param {Application} app - The scaffold app.
 * @param {Command} command - The command to be executed.
 * @param {ExecutionInformation} info - The execution information.
 * @return {Void} This function returns nothing.
 */
const executeCommand = async (app, command, info) => {
  if (!command.created) {
    throw error('please create command first.');
  }
  if (command.composedOf) {
    await eachAsync(command.composedOf, async (subcommandName) => {
      const subcommand = loadCommand(app, subcommandName);
      await executeCommand(
        app,
        subcommand,
        Object.assign(info, command.composingParams)
      );
    });
  } else {
    await command.execute(info);
  }
};

module.exports = executeCommand;
