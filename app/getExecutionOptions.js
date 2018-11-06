const merge = require('lodash/merge');
const map = require('lodash/map');
const assign = require('lodash/assign');

const getDefaultValues = (options) =>
  merge(...map(options, (option) => ({ [option.name]: option.defaultValue })));

const getExecutionOptions = (app, command, input) => {
  const appDefaults = getDefaultValues(app.options);
  // resolved app options
  // combines user input and app default options
  // this is used for getting user's behavioral settings
  const resolvedAppOptions = assign({}, appDefaults, input.options);
  // get user's behavioral settings
  


  //const commandDefaults = getDefaultValues(command.options);
};

module.exports = getExecutionOptions;
