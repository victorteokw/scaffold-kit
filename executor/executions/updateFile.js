const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const isEqual = require('lodash/isEqual');
const getDestination = require('../getDestination');

const updateFile = ({ at, updator, silent }) => {

  const dest = path.join(getDestination(), at);
  if (fs.existsSync(dest)) {
    const before = fs.readFileSync(dest).toString();
    const after = updator(before);
    if (isEqual(before, after)) {
      return ['up-to-date', 'yellow', at, silent];
    } else {
      fs.writeFileSync(at, after);
      return ['update', 'green', at, silent];
    }
  } else {
    mkdirp.sync(path.dirname(dest));
    fs.writeFileSync(at, updator(''));
    return ['create', 'green', at, silent];
  }
};

module.exports = updateFile;
