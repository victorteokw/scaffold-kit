const map = require('lodash.map');
const merge = require('lodash.merge');
const mapValues = require('lodash.mapvalues');
const error = require('../error');
const savedCommandLineOptions = require('./savedCommandLineOptions');
const showAppHelpMessage = require('./showAppHelpMessage');
const showAppVersion = require('./showAppVersion');
const showCommandHelpMessage = require('./showCommandHelpMessage');
const getUserCommandLineInput = require('./getUserCommandLineInput');
const commandExecutionDirectory = require('./commandExecutionDirectory');
const { executeAllInstructions } = require('../executor');
const { loadCommand, executeCommand } = require('../command');

const startApp = (app, argv = process.argv) => {
  if (!app.created) {
    throw error('app is not created.');
  }
  const { command, options, args } = getUserCommandLineInput(app, argv);
  // Show version and exit
  if (options.version) {
    showAppVersion(app);
    return;
  }
  // Show help and exit
  if (!command) {
    showAppHelpMessage(app);
    return;
  }
  const commandObject = loadCommand(app, command);
  if (command && options.help) {
    showCommandHelpMessage(app, command, commandObject);
    return;
  }
  const savedOptions = savedCommandLineOptions(process.cwd());
  const userOptions = merge(savedOptions, options);
  const appDefaultOptions = mapValues(app.appLevelCommandLineOptions, 'default');
  const commandDefaultOptions = mapValues(commandObject.commandLineOptions, 'default');
  const behavioralDefaultOptions = !app.behaviorsMap ? {} : map(app.behaviorsMap, (b) => {
    const dv = b.defaultFrom;
    const v = userOptions[dv] || commandDefaultOptions[dv] || appDefaultOptions[dv];
    const item = b.items[v];
    return mapValues(item.extraOptions, 'default');
  });
  const totalDefaultOptions = merge({}, appDefaultOptions, ...behavioralDefaultOptions, commandDefaultOptions);
  if (commandObject.dynamicOptions) {
    merge(
      totalDefaultOptions,
      mapValues(commandObject.dynamicOptions({ args, userOptions }), 'default')
    );
  }
  const finalOptions = merge({}, totalDefaultOptions, userOptions);

  const nonDefaultOptions = Object.assign({}, finalOptions);
  Object.keys(nonDefaultOptions).forEach((k) => {
    if (nonDefaultOptions[k] === totalDefaultOptions[k]) {
      delete nonDefaultOptions[k];
    }
  });
  const appSerializableOptions = mapValues(app.appLevelCommandLineOptions, 'saveToPreference');
  const commandSerializableOptions = mapValues(commandObject.commandLineOptions, 'saveToPreference');
  const behavioralSerializableOptions = !app.behaviorsMap ? {} : map(app.behaviorsMap, (b) => {
    const dv = b.defaultFrom;
    const v = userOptions[dv] || commandDefaultOptions[dv] || appDefaultOptions[dv];
    const item = b.items[v];
    return mapValues(item.extraOptions, 'saveToPreference');
  });
  const serializableOptions = Object.assign({}, appSerializableOptions, commandSerializableOptions, ...behavioralSerializableOptions);
  const nonDefaultOptionsToSave = {};
  map(nonDefaultOptions, (v, k) => {
    if (serializableOptions[k]) {
      nonDefaultOptionsToSave[k] = v;
    }
  });
  // Command modifies cwd
  let cwd = commandExecutionDirectory(commandObject);
  if (commandObject.relocateCwd) {
    cwd = commandObject.relocateCwd({ args, options: finalOptions, cwd });
    process.chdir(cwd);
  }
  executeCommand(app, commandObject, { cwd, options: finalOptions, args });
  executeAllInstructions(cwd);
};


module.exports = startApp;
