const findKey = require('lodash/findKey');

const reverseInsts = {
  'createFile': 'deleteFile',
  'appendFile': 'detachFromFile',
  'updateJSONFile': 'rollbackJSONFile',
  'installDependency': 'removeDependency',
  'runShellCommand': 'undoShellCommand'
};

const equal = (value) => {
  return (v) => v === value;
};

const findRevertInst = (name) => {
  return reverseInsts[name] || findKey(reverseInsts, equal(name)) || name;
};

const revertInstruction = ({ name, params }) => {
  return { name: findRevertInst(name), params };
};

module.exports = revertInstruction;
