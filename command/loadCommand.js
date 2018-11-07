const error = require('../error');

/**
 * Load a command for an app.
 *
 * @param {Application} app - The scaffold app.
 * @param {String} commandName - The name of the command to be executed.
 * @return {Command} This function returns the loaded command.
 */
const loadCommand = (app, commandName) => {
  if (!app.commands[commandName]) {
    throw error(`command '${commandName}' not exist.`);
  }
  let command;
  try {
    command = require(app.commands[commandName]);
  } catch(e) {
    console.log(e);
    throw error(`command '${commandName}' can't be required.`);
  }
  return command;
};

module.exports = loadCommand;
