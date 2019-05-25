import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import KeepDirectoryInGitInfo from '../instructions/KeepDirectoryInGitInfo';
import Reporter from '../Reporter';
import isDefined from '../utilities/isDefined';

const keepDirectoryInGit = (
  params: KeepDirectoryInGitInfo,
  reporter: Reporter,
) => {
  let { at } = params;
  if (!isDefined(at)) {
    throw new Error(`You should provide the path, the current path:'${at}'.`);
  }
  const keepFilename = '.keep';
  if (fs.existsSync(at) && fs.lstatSync(at).isDirectory()) {
    // the directory exist
    const filenames = fs.readdirSync(at);
    if (filenames.includes(keepFilename) && filenames.length > 1) {
      fs.unlinkSync(path.join(at, keepFilename));
      reporter.push({ message: 'delete', file: at });
    } else if (filenames.length === 0) {
      fs.writeFileSync(path.join(at, keepFilename), '');
      reporter.push({ message: 'create', file: at });
    }
  } else if (fs.existsSync(at)) {
    // the directory is a file
    // do nothing
  } else {
    // the directory not exist at all
    mkdirp.sync(at);
    fs.writeFileSync(path.join(at, keepFilename), '');
    reporter.push({ message: 'create', file: at });
  }
};

export default keepDirectoryInGit;
