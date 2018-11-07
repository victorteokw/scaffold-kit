const map = require('lodash/map');
const concat = require('lodash/concat');

const loadCommand = require('../command/loadCommand');

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

module.exports = getCommandOptions;
