const findDominantFile = require('find-dominant-file');
const error = require('../error');

module.exports = (app, cwd = process.cwd()) => {
  if (!app.rcFile) return {};
  const rcFile = findDominantFile(cwd, app.rcFile);
  if (!rcFile) return {};
  try {
    return require(rcFile);
  } catch(e) {
    throw error(`'${rcFile}' malformed.`);
  }
};
