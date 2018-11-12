const fs = require('fs');
const path = require('path');
const findDominantFile = require('find-dominant-file');
const each = require('lodash/each');
const kebabCase = require('lodash/kebabCase');
const chalk = require('chalk');

const updateRcFile = (app, undefaultOptions, wd) => {
  if (!app.rcFile) return;
  let filename = findDominantFile(wd, app.rcFile);
  if (!filename) {
    filename = path.join(wd, app.rcFile);
  }
  let content;
  if (fs.existsSync(filename)) {
    content = JSON.parse(fs.readFileSync(filename).toString());
  } else {
    content = {};
  }
  each(undefaultOptions, (value, name) => {
    if (value === '__delete__') {
      console.log(`${chalk.green('config'.padStart(12))} delete '${name}'`);
      delete content[name];
    } else {
      console.log(`${chalk.green('config'.padStart(12))} add '--${kebabCase(name)}=${value}'`);
      content[name] = value;
    }
  });
  fs.writeFileSync(filename, JSON.stringify(content, null, 2));
};

module.exports = updateRcFile;
