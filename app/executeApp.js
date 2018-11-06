const parsingCommandLineArgs = require('./parsingCommandLineArgs');
const displayAppVersion = require('./displayAppVersion');
const displayAppHelp = require('./displayAppHelp');
const displayCommandHelp = require('./displayCommandHelp');
const getWorkingDirectory = require('./getWorkingDirectory');
const getExecutionOptions = require('./getExecutionOptions');
const { loadCommand } = require('../command');

const executeApp = async (app, argv = process.argv) => {
  // Get user's input
  const input = parsingCommandLineArgs(argv, app);
  // Display version and exit
  if (input.options.version) {
    displayAppVersion(app);
    return;
  }
  // Display app help and exit
  if (!input.command) {
    displayAppHelp(app);
    return;
  }
  const command = loadCommand(app, input.command);
  // Display command help and exit
  if (input.options.help) {
    displayCommandHelp(app, input.command, command);
    return;
  }
  // Get working directory
  const workingDirectory = getWorkingDirectory(app, command);
  // Get execution options
  const options = getExecutionOptions(app, command, input, workingDirectory);
};

module.exports = executeApp;
