const fs = require('fs');
const path = require('path');
const findDominantFile = require('find-dominant-file');
const each = require('lodash/each');
const kebabCase = require('lodash/kebabCase');

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
  console.log(`update ${app.rcFile}`);
  each(undefaultOptions, (value, name) => {
    if (value === '__delete__') {
      console.log(`delete: ${name}`);
      delete content[name];
    } else {
      console.log(`add: --${kebabCase(name)} = ${value}`);
      content[name] = value;
    }
  });
  fs.writeFileSync(filename, JSON.stringify(content, null, 2));
};

module.exports = updateRcFile;
