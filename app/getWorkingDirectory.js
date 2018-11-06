const findDominantFile = require('find-dominant-file');

const getWorkingDirectory = (app, command) => {
  let workingDirectory = process.cwd();
  if (command.executeInProjectRootDirectory) {
    workingDirectory = findDominantFile(workingDirectory, 'package.json', true);
  }
  return workingDirectory;
};

module.exports = getWorkingDirectory;
