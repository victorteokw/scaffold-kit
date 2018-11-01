const cloneDeep = require('lodash/cloneDeep');

const options = {};

const getExecutorOptions = () => {
  return cloneDeep(options);
};

//overwrite, silent, mock
const setExecutorOption = (key, value) => {
  options[key] = value;
};

module.exports = {
  setExecutorOption,
  getExecutorOptions
};
