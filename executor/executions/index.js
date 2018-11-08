const createFile = require('./createFile');
const deleteFile = require('./deleteFile');
const appendFile = require('./appendFile');
const detachFromFile = require('./detachFromFile');
const updateJSONFile = require('./updateJSONFile');
const rollbackJSONFile = require('./rollbackJSONFile');
const installDependency = require('./installDependency');
const removeDependency = require('./removeDependency');
const keepDirectoryInGit = require('./keepDirectoryInGit');
const runShellCommand = require('./runShellCommand');
const undoShellCommand = require('./undoShellCommand');

module.exports = {
  createFile,
  deleteFile,
  appendFile,
  detachFromFile,
  updateJSONFile,
  rollbackJSONFile,
  installDependency,
  removeDependency,
  keepDirectoryInGit,
  runShellCommand,
  undoShellCommand
};
