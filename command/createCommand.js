const error = require('../error');

/**
 * Command line option object.
 *
 * @typedef {Object} CommandLineOption
 * @property {('boolean'|'string'|'number')} type - The option type.
 * @property {(String|Number|Boolean)} default - The option's default value.
 * @property {String} description - The option's description.
 * @property {Boolean} saveToPreference - Thether save the option to .rc file.
 */

/**
 * The execution information object.
 *
 * @typedef {Object} ExecutionInformation
 * @property {String[]} args - The command line arguments.
 * @property {Object} options - The final execution options.
 * @property {String} cwd - The original current working directory.
 */

/**
 * The function that relocates current working directory.
 *
 * @callback RelocateCwd
 * @param {ExecutionInformation} info - The execution information.
 * @return {String} The current working directory that relocated.
 */

/**
 * The function that executes the command.
 *
 * @callback CommandExecution
 * @param {ExecutionInformation} info - The execution information.
 * @return {Void} This function returns nothing.
 */

/**
 * The command object.
 *
 * @typedef {Object} Command
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
 * Create an executable command.
 *
 * @param {Command} command - The command descriptor.
 * @return {Void} This function returns nothing.
 */
const createCommand = (command) => {
  if (!command) {
    throw error('please provide command descriptor.');
  }
  if (!command.options) command.options = {};
  return command;
};

module.exports = createCommand;
