const findDominantFile = require('find-dominant-file');

module.exports = (command, cwd = process.cwd()) => {
  const jumpToRoot = command.executeInProjectRootDirectory;
  return jumpToRoot ? findDominantFile(cwd, 'package.json', true) : cwd;
};
