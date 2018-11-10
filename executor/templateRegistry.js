const fs = require('fs');
const path = require('path');
const eachRight = require('lodash/eachRight');
const error = require('../error');

let directories = [];

const templateRegistry = {
  add(dir) {
    if (!fs.existsSync(dir)) {
      throw error(`template directory '${dir}' is not exist.`);
    }
    directories.push(dir);
  },
  clear() {
    directories = [];
  },
  resolveTemplatePath(name) {
    if (path.isAbsolute(name)) {
      if (fs.existsSync(name)) {
        return name;
      } else {
        throw error(`cannot find template '${name}'.`);
      }
    }
    let resolved = undefined;
    eachRight(directories, (dir) => {
      if (!resolved) {
        const maybe = path.join(dir, name);
        if (fs.existsSync(maybe)) resolved = maybe;
      }
    });
    if (!resolved) {
      throw error(`cannot find template '${name}'.`);
    }
    return resolved;
  }
};

module.exports = templateRegistry;
