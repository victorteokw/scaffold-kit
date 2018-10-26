const loadCommand = require('./loadCommand');

/**
 * Execute a command.
 *
 * @param {Application} app - The scaffold app.
 * @param {Command} command - The command to be executed.
 * @param {ExecutionInformation} info - The execution information.
 */
const executeCommand = (app, command, info) => {
  if (command.composedOf) {
    command.composedOf.forEach((subcommandName) => {
      const subcommand = loadCommand(app, subcommandName);
      executeCommand(
        app,
        subcommand,
        Object.assign(info, command.composingParams)
      );
    });
  } else {
    command.execute(info);
  }
};

module.exports = executeCommand;
