const merge = require('lodash/merge');
const map = require('lodash/map');
const assign = require('lodash/assign');
const find = require('lodash/find');
const concat = require('lodash/concat');

const parsingCommandLineArgs = require('./parsingCommandLineArgs');

const getDefaultValues = (options) =>
  merge(...map(options, (option) => ({ [option.name]: option.defaultValue })));

const getOptionList = (app, command, behaviorals) => {
  const appOptions = app.options;
  const commandOptions = command.options;
  const behavioralOptions = map(app.behaviorals, (b) => {
    return find(b.values, (v) => v.name === behaviorals[b.optionName]).options;
  });
  return concat(appOptions, commandOptions, ...behavioralOptions);
};

const getExecutionOptions = (argv, app, command, input, wd) => {
  // get app default options
  const appDefaults = getDefaultValues(app.options);
  // resolved app options
  // combines user input and app default options
  // this is used for getting user's behavioral settings
  const resolvedAppOptions = assign({}, appDefaults, input.options);
  // get user's behavioral settings
  const behaviorals = merge(...map(
    app.behaviorals,
    (b) => ({ [b.optionName]: resolvedAppOptions[b.optionName] })
  ));
  // with user's behavioral settings, we pass user's input again this time
  const optionList = getOptionList(app, command, behaviorals);
  const userInput = parsingCommandLineArgs(optionList);

  //const commandDefaults = getDefaultValues(command.options);
};

module.exports = getExecutionOptions;
