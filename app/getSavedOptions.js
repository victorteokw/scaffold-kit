const fs = require('fs');
const findDominantFile = require('find-dominant-file');
const error = require('../error');

const getSavedOptions = (app, cwd = process.cwd()) => {
  if (!app.rcFile) return {};
  const rcFile = findDominantFile(cwd, app.rcFile);
  if (!rcFile) return {};
  try {
    return JSON.parse(fs.readFileSync(rcFile).toString());
  } catch(e) {
    throw error(`'${rcFile}' malformed.`);
  }
};

module.exports = getSavedOptions;
