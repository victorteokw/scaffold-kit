const createFile = require('./createFile');
const deleteFile = require('./deleteFile');
const appendFile = require('./appendFile');
const detachFromFile = require('./detachFromFile');
const installDependency = require('./installDependency');
const removeDependency = require('./removeDependency');
const keepDirectoryInGit = require('./keepDirectoryInGit');
const runShellCommand = require('./runShellCommand');

module.exports = {
  createFile,
  deleteFile,
  appendFile,
  detachFromFile,
  installDependency,
  removeDependency,
  keepDirectoryInGit,
  runShellCommand
};
