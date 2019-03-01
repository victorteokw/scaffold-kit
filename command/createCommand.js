const error = require('../error');

const createCommand = (descriptor) => {
  if (!descriptor) {
    throw error('please provide command descriptor.');
  }
  return descriptor;
};

module.exports = createCommand;
