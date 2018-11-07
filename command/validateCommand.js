const watsons = require('watsons.js');
const error = require('../error');

const commandSchema = {
  description: watsons.string.required,
  usage: watsons.string,
  examples: watsons.arrayOf(
    watsons.string
  ),
  executeInProjectRootDirectory: watsons.boolean,
  options: watsons.arrayOf(
    watsons.shape({

      type: watsons.oneOf(['string', 'number', 'boolean']).required,
      defaultValue: watsons.any, // TODO: make default work
      description: watsons.string,
      saveToPreference: watsons.bool
    })
  ),
  relocateCwd: watsons.func,
  execute: watsons.func,
  composedOf: watsons.arrayOf(
    watsons.string
  ),
  composingParams: watsons.object,
  composeOptions: watsons.bool
};

const validateCommand = (descriptor) => {
  // Validate first
  //watsons.validate(descriptor, commandSchema);
  if (descriptor.execute && descriptor.composedOf) {
    throw error("a command cannot have \
'execute' and 'composedOf' at the same time.");
  }
  // Apply default values
  if (descriptor.executeInProjectRootDirectory === undefined) {
    descriptor.executeInProjectRootDirectory = true;
  }
  descriptor.created = true;
  return descriptor;
};

module.exports = validateCommand;
