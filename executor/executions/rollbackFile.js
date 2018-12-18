const fs = require('fs');
const path = require('path');
const isEqual = require('lodash/isEqual');
const getDestination = require('../getDestination');

const rollbackFile = ({ at, rollbacker, silent }) => {
  const dest = path.join(getDestination(), at);
  if (fs.existsSync(dest)) {
    const before = fs.readFileSync(dest).toString();
    const after = rollbacker(before);
    if (isEqual(before, after)) {
      return ['unchanged', 'yellow', at, silent];
    } else {
      fs.writeFileSync(at, after);
      return ['rollback', 'green', at, silent];
    }
  } else {
    // file not exist, can not rollback
    return ['not exist', 'red', at, silent];
  }
};

module.exports = rollbackFile;
