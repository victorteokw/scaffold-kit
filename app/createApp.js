const map = require('lodash/map');
const error = require('../error');

/**
 * The app object.
 *
 * @typedef {Object} App
 * @property {String} description - The description of the command.
 * @property {String} usage - The usage of the command.
 * @property {String[]} examples - The examples of this command.
 * @property {Boolean} executeInProjectRootDirectory - Should the command be
 * executed in project root directory.
 * @property {CommandLineOption[]} commandLineOptions - The command line option
 * specifications.
 * @property {RelocateCwd} relocateCwd - The function that relocates
 * the project root directory.
 * @property {CommandExecution} execute - The execution function.
 */

/**
 * Create an app.
 *
 * @param {App} app - The app descriptor.
 * @return {App} The created app.
 */
const createApp = (app) => {
  validateApp(app);
  app.created = true;
  return app;
};

const validateApp = (app) => {
  if (!app.appName) {
    throw error('app name is required.');
  }
  if (!app.description) {
    throw error('app description is required.');
  }
  if (!app.version) {
    throw error('app version is required.');
  }
  // Validate options later
  if (!app.commandsMap) {
    throw error('app commands map is required.');
  }
  map(app.commandsMap, (modulePath, commandName) => {
    if (!commandName || !commandName.match(/[a-z0-9][a-zA-Z0-9]*/)) {
      throw error(`app command name '${commandName}' not valid.`);
    }
    if (!modulePath) {
      throw error(`module path is required for command '${commandName}'.`);
    }
  });
};

module.exports = createApp;
