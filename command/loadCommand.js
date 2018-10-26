const error = require('../error');

/**
 * Load a command for an app.
 *
 * @param {Application} app - The scaffold app.
 * @param {String} commandName - The name of the command to be executed.
 * @return {Void} This function returns nothing.
 */
const loadCommand = (app, commandName) => {
  if (!app.commandsMap[commandName]) {
    throw error(`command '${commandName}' not exist.`);
  }
  let command;
  try {
    command = require(app.commandsMap[commandName]);
  } catch(e) {
    throw error(`command '${commandName}' can't be required.`);
  }
  return command;
};

module.exports = loadCommand;
