import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import { includes } from 'lodash';
const outputMessage = require('./outputMessage');

const keepDirectoryInGit = ({ at, silent }) => {
  const keepFilename = '.keep';
  const dir = at;
  if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) {
    // the directory exist
    const filenames = fs.readdirSync(dir);
    if (includes(filenames, keepFilename) && filenames.length > 1) {
      fs.unlinkSync(path.join(dir, keepFilename));
      outputMessage('delete', 'green', path.join(at, keepFilename), silent);
    } else if (filenames.length === 0) {
      fs.writeFileSync(path.join(dir, keepFilename), '');
      outputMessage('create', 'green', path.join(at, keepFilename), silent);
    }
  } else if (fs.existsSync(dir)) {
    // the directory is a file
    // do nothing
  } else {
    // the directory not exist at all
    mkdirp.sync(dir);
    fs.writeFileSync(path.join(dir, keepFilename), '');
    outputMessage('create', 'green', path.join(at, keepFilename), silent);
  }
};

export default keepDirectoryInGit;
