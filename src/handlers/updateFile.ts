import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import { isEqual } from 'lodash';
import UpdateFileInfo from '../instructions/UpdateFileInfo';
import Reporter from '../Reporter';
import isDefined from '../utilities/isDefined';

const updateFile = (params: UpdateFileInfo, reporter: Reporter) => {
  let { at, updator } = params;

  if (!isDefined(at) && !isDefined(updator)) {
    throw new Error(`you should provide at and updator`);
  }

  if (fs.existsSync(at)) {
    const before = fs.readFileSync(at).toString();
    const after = updator(before);
    if (isEqual(before, after)) {
      reporter.push({ message: 'up-to-date', file: at });
    } else {
      fs.writeFileSync(at, after);
      reporter.push({ message: 'update', file: at });
    }
  } else {
    mkdirp.sync(path.dirname(at));
    fs.writeFileSync(at, updator(''));
    reporter.push({ message: 'create', file: at });
  }
};

export default updateFile;
