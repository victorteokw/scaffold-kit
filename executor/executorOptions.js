const cloneDeep = require('lodash/cloneDeep');
const map = require('lodash/map');
const keys = require('lodash/keys');

const options = {};

const getExecutorOptions = () => {
  return cloneDeep(options);
};

//overwrite, silent, mock
const setExecutorOption = (key, value) => {
  options[key] = value;
};

const resetExecutorOptions = () => {
  map(keys(options), (k) => delete options[k]);
};

module.exports = {
  setExecutorOption,
  getExecutorOptions,
  resetExecutorOptions
};
