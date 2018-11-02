const fs = require('fs');
const path = require('path');
const getDestination = require('../getDestination');

const deleteFile = ({ at, silent }) => {
  const dest = path.join(getDestination(), at);
  if (fs.existsSync(dest)) {
    // delete file
    fs.unlinkSync(dest);
    return ['delete', 'green', at, silent];
  } else {
    // do nothing
    return ['not exist', 'yellow', at, silent];
  }
};

module.exports = deleteFile;
