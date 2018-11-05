const parsingCommandLineArgs = require('./parsingCommandLineArgs');
const displayAppVersion = require('./displayAppVersion');
const displayAppHelp = require('./displayAppHelp');
const displayCommandHelp = require('./displayCommandHelp');
const { loadCommand } = require('../command');

const executeApp = async (app, argv = process.argv) => {
  const commandLineInput = parsingCommandLineArgs(argv);
  if (commandLineInput.options.version) {
    displayAppVersion(app);
    return;
  }
  if (!commandLineInput.command) {
    displayAppHelp(app);
    return;
  }
  const command = loadCommand(app, commandLineInput.command);
  if (commandLineInput.options.help) {
    displayCommandHelp(app, commandLineInput.command, command);
    return;
  }
};

module.exports = executeApp;
