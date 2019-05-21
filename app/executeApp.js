const mkdirp = require('mkdirp');

const isEmpty = require('lodash/isEmpty');
const pick = require('lodash/pick');
const assign = require('lodash/assign');

const parsingCommandLineArgs = require('./parsingCommandLineArgs');
const displayAppVersion = require('./displayAppVersion');
const displayAppHelp = require('./displayAppHelp');
const displayCommandHelp = require('./displayCommandHelp');
const getWorkingDirectory = require('./getWorkingDirectory');
const getExecutionOptions = require('./getExecutionOptions');
const getSavedOptions = require('./getSavedOptions');
const updateRcFile = require('./updateRcFile');
const { loadCommand, executeCommand } = require('../command');
const executeAllInstructions = require('../executor/executeAllInstructions');
const setDestination = require('../executor/setDestination');

const executeApp = async (app, argv = process.argv) => {
  // Get user's input
  const input = parsingCommandLineArgs(argv, app.options, getSavedOptions(app));
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
  let command;
  try {
    command = loadCommand(app, input.command);
  } catch(e) {
    console.log(`\nCommand '${input.command}' not exist.\n`);
    process.exit(1);
  }
  // Display command help and exit
  if (input.options.help) {
    displayCommandHelp(app, input.command, command, input);
    return;
  }
  // Get working directory
  const wd = getWorkingDirectory(app, command);
  // Get execution options
  const executionOptions = getExecutionOptions(argv, app, command, input, wd);

  let executionParams = assign(pick(executionOptions, [
    'options', 'args', 'command'
  ]), { wd });
  // execution
  mkdirp.sync(executionParams.wd);
  process.chdir(executionParams.wd);
  setDestination(executionParams.wd);
  // Update rcFile
  if (app.rcFile && !isEmpty(executionOptions.undefaultOptions)) {
    updateRcFile(app, executionOptions.undefaultOptions, executionParams.wd);
  }
  await executeCommand(app, command, executionParams);
  await executeAllInstructions();
};

module.exports = executeApp;
