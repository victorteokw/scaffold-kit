import * as fs from 'fs';
import * as path from 'path';

const deleteFile = ({ at, silent }) => {
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

export default deleteFile;
