const eachAsync = require('series-async-each');
const loadCommand = require('./loadCommand');

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
