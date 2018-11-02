const installDependency = require('./installDependency');
const removeDependency = require('./removeDependency');
const keepDirectoryInGit = require('./keepDirectoryInGit');
const runShellCommand = require('./runShellCommand');

module.exports = {
  installDependency,
  removeDependency,
  keepDirectoryInGit,
  runShellCommand
};
