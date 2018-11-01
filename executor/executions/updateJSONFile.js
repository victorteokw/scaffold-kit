const fs = require('fs');
const cloneDeep = require('lodash/cloneDeep');

const updateJSONFile = ({ at, updator, silent }) => {
  let original;
  if (!fs.existsSync(at)) {
    original = {};
  } else {
    original = JSON.parse(fs.readFileSync(at).toString());
  }
  const updated = updator(cloneDeep(original));
  fs.writeFileSync(at, JSON.stringify(updated, null, 2));
};

module.exports = updateJSONFile;
