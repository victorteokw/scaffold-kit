const findKey = require('lodash/findKey');

const reverseInsts = {
  'createFile': 'deleteFile',
  'appendFile': 'detachFromFile',
  'updateFile': 'rollbackFile',
  'updateJSONFile': 'rollbackJSONFile',
  'installDependency': 'removeDependency',
  'runShellCommand': 'undoShellCommand'
};

const equal = (value) => {
  return (v) => v === value;
};

const findReverseInst = (name) => {
  return reverseInsts[name] || findKey(reverseInsts, equal(name)) || name;
};

const reverseInstruction = ({ name, params }) => {
  return { name: findReverseInst(name), params };
};

module.exports = reverseInstruction;
