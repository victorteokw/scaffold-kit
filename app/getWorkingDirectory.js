const findDominantFile = require('find-dominant-file');

const getWorkingDirectory = (app, command) => {
  let wd = process.cwd();
  if (command.executeInProjectRootDirectory) {
    wd = findDominantFile(wd, 'package.json', true) || wd;
  }
  return wd;
};

module.exports = getWorkingDirectory;
