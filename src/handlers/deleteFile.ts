import * as fs from 'fs';;
import * as path from 'path';

export default function deleteFile ({ at, silent }) {
  const dest = at;
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
