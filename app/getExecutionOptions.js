const merge = require('lodash/merge');
const map = require('lodash/map');
const each = require('lodash/each');
const assign = require('lodash/assign');
const find = require('lodash/find');
const concat = require('lodash/concat');
const get = require('lodash/get');

const parsingCommandLineArgs = require('./parsingCommandLineArgs');
const getSavedOptions = require('./getSavedOptions');

const loadCommand = require('../command/loadCommand');

const getDefaultValues = (options) =>
  merge(...map(options, (option) => ({ [option.name]: option.defaultValue })));

const unwrapOptions = (options, input) => {
  if (options.call) {
    return unwrapOptions(options(input), input);
  } else {
    return options || [];
  }
};

const getCommandOptions = (app, command, input) => {
  if (command.composedOf && command.composeOptions) {
    return concat(...map(command.composedOf, (subcommand) => {
      return getCommandOptions(app, loadCommand(app, subcommand));
    }));
  } else {
    return unwrapOptions(command.options, input);
  }
};

const getOptionList = (app, command, behaviorals, input) => {
  const appOptions = app.options;
  const commandOptions = getCommandOptions(app, command, input);
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
  const optionList = getOptionList(app, command, behaviorals, input);
  // reparse user input with full option list
  const userInput = parsingCommandLineArgs(argv, optionList);
  // get saved options
  const savedOptions = getSavedOptions(app, wd);
  // get all default values
  const allDefaults = getDefaultValues(optionList);
  // merge all options
  const options = merge({}, allDefaults, savedOptions, userInput.options);

  // parsing undefault options and pass back to main function.

  const isSavableOption = (name) => {
    return get(find(optionList, (o) => o.name === name), 'saveToPreference');
  };

  const isDefaultValue = (name, value) => {
    return get(
      find(optionList, (o) => o.name === name),
      'defaultValue'
    ) === value;
  };

  const isPresentInSavedOption = (name) => {
    return savedOptions[name] !== undefined;
  };

  const isSameWithSavedOption = (name) => {
    return isPresentInSavedOption(name)
      && (savedOptions[name] === options[name]);
  };

  const undefaultOptions = {};

  each(userInput.options, (value, name) => {
    if (isSavableOption(name) && !isSameWithSavedOption(name)) {
      if (isDefaultValue(name, value)) {
        if (isPresentInSavedOption(name)) {
          // remove from rc file
          undefaultOptions[name] = '__delete__';
        }
      } else {
        // update rc file
        undefaultOptions[name] = value;
      }
    }
  });

  return {
    options,
    args: userInput.args,
    command: userInput.command,
    undefaultOptions
  };
};

module.exports = getExecutionOptions;
