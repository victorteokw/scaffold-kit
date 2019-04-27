const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const isEqual = require('lodash/isEqual');
const cloneDeep = require('lodash/cloneDeep');
const getDestination = require('../getDestination');

const updateJSONFile = ({ at, updator, silent }) => {

  const dest = path.join(getDestination(), at);
  if (fs.existsSync(dest)) {
    const before = JSON.parse(fs.readFileSync(dest).toString());
    const after = updator(cloneDeep(before));
    if (isEqual(before, after)) {
      return ['up-to-date', 'yellow', at, silent];
    } else {
      fs.writeFileSync(at, JSON.stringify(after, null, 2) + '\n');
      return ['update', 'green', at, silent];
    }
  } else {
    mkdirp.sync(path.dirname(dest));
    fs.writeFileSync(at, JSON.stringify(updator({}), null, 2) + '\n');
    return ['create', 'green', at, silent];
  }
};

module.exports = updateJSONFile;
