const fs = require('fs');
const path = require('path');
const isEqual = require('lodash/isEqual');
const cloneDeep = require('lodash/cloneDeep');
const getDestination = require('../getDestination');

const rollbackJSONFile = ({ at, rollbacker, silent }) => {
  const dest = path.join(getDestination(), at);
  if (fs.existsSync(dest)) {
    const before = JSON.parse(fs.readFileSync(dest).toString());
    const after = rollbacker(cloneDeep(before));
    if (isEqual(before, after)) {
      return ['unchanged', 'yellow', at, silent];
    } else {
      fs.writeFileSync(at, JSON.stringify(after, null, 2) + '\n');
      return ['rollback', 'green', at, silent];
    }
  } else {
    // file not exist, can not rollback
    return ['not exist', 'red', at, silent];
  }
};

module.exports = rollbackJSONFile;
