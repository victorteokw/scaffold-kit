const watsons = require('watsons.js');
const error = require('../error');

const commandSchema = {
  description: watsons.string.required,
  usage: watsons.string,
  examples: watsons.arrayOf(
    watsons.string
  ),
  executeInProjectRootDirectory: watsons.boolean,
  commandLineOptions: watsons.objectOf(
    watsons.shape({
      type: watsons.oneOf(['string', 'number', 'boolean']).required,
      default: watsons.any, // TODO: make default work
      description: watsons.string,
      saveToPreference: watsons.bool
    })
  ),
  relocateCwd: watsons.func,
  execute: watsons.func,
  composedOf: watsons.arrayOf(
    watsons.string
  ),
  composingParams: watsons.object
};

const validateCommand = (descriptor) => {
  // Validate first
  watsons.validate(descriptor, commandSchema);
  if (descriptor.execute && descriptor.composedOf) {
    throw error("a command cannot have \
'execute' and 'composedOf' at the same time.");
  }
  // Apply default values
  if (descriptor.executeInProjectRootDirectory === undefined) {
    descriptor.executeInProjectRootDirectory = true;
  }
  descriptor.validated = true;
  return descriptor;
};

module.exports = validateCommand;
