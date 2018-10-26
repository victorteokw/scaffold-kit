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
 * @property {String} projDir - The original project root directory.
 */

/**
 * The function that relocates project root directory.
 *
 * @callback RelocateProjDir
 * @param {ExecutionInformation} info - The execution information.
 * @return {String} The project directory that relocated.
 */

/**
 * The function that executes the command.
 *
 * @callback CommandExecution
 * @param {ExecutionInformation} info - The execution information.
 * @return {Void} This function returns nothing.
 */

/**
 * Create an executable command.
 *
 * @param {Object} command - The command descriptor.
 * @param {String} command.description - The description of the command.
 * @param {String} command.usage - The usage of the command.
 * @param {String[]} command.examples - The examples of this command.
 * @param {Boolean} command.executeInProjectRootDirectory - Should the command be executed in project root directory.
 * @param {Option} command.commandLineOptions - The command line option specifications.
 * @param {RelocateProjDir} command.relocateProjDir - The function that relocates the project root directory.
 * @param {CommandExecution} command.execute - The execution function.
 */
const createCommand = (command) => {
  if (!command) {
    throw error('please provide command descriptor.');
  }
  if (!command.options) command.options = {};
  return command;
};
