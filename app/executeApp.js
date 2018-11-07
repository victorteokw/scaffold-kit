const isEmpty = require('lodash/isEmpty');
const pick = require('lodash/pick');
const assign = require('lodash/assign');

const parsingCommandLineArgs = require('./parsingCommandLineArgs');
const displayAppVersion = require('./displayAppVersion');
const displayAppHelp = require('./displayAppHelp');
const displayCommandHelp = require('./displayCommandHelp');
const getWorkingDirectory = require('./getWorkingDirectory');
const getExecutionOptions = require('./getExecutionOptions');
const updateRcFile = require('./updateRcFile');
const { loadCommand, executeCommand } = require('../command');
const executeAllInstructions = require('../executor/executeAllInstructions');

const executeApp = async (app, argv = process.argv) => {
  // Get user's input
  const input = parsingCommandLineArgs(argv, app.options);
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
  const wd = getWorkingDirectory(app, command);
  // Get execution options
  const executionOptions = getExecutionOptions(argv, app, command, input, wd);
  // Update rcFile
  if (app.rcFile && !isEmpty(executionOptions.undefaultOptions)) {
    updateRcFile(app, executionOptions.undefaultOptions, wd);
  }
  let executionParams = assign(pick(executionOptions, [
    'options', 'args', 'command'
  ]), { wd });
  // App before hook
  if (app.beforeExecution) {
    const retval = await app.beforeExecution(executionParams);
    if (retval) executionParams = assign({}, executionParams, retval);
  }
  // Command before hook
  if (command.beforeExecution) {
    const retval = await command.beforeExecution(executionParams);
    if (retval) executionParams = assign({}, executionParams, retval);
  }
  // execution
  await executeCommand(app, command, executionParams);
  await executeAllInstructions();
  // Command after hook
  if (command.afterExecution) {
    const retval = await command.afterExecution(executionParams);
    if (retval) executionParams = assign({}, executionParams, retval);
  }
  // App after hook
  if (app.afterExecution) {
    await app.afterExecution(executionParams);
  }
};

module.exports = executeApp;
