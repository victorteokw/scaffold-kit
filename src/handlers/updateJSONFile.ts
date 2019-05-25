import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import { isEqual, cloneDeep } from 'lodash';
import isDefined from '../utilities/isDefined';
import UpdateJSONFileInfo from '../instructions/UpdateJSONFileInfo';
import Reporter from '../Reporter';

const updateJSONFile = (params: UpdateJSONFileInfo, reporter: Reporter) => {
  let { at, updator } = params;

  if (!isDefined(at) && !isDefined(updator)) {
    throw new Error(`you should provide at and updator`);
  }

  const dest = at;
  if (fs.existsSync(dest)) {
    const before = JSON.parse(fs.readFileSync(dest).toString());
    const after = updator(cloneDeep(before));
    if (isEqual(before, after)) {
      reporter.push({ message: 'up-to-date', file: at });
    } else {
      fs.writeFileSync(at, JSON.stringify(after, null, 2) + '\n');
      reporter.push({ message: 'update', file: at });
    }
  } else {
    mkdirp.sync(path.dirname(dest));
    fs.writeFileSync(at, JSON.stringify(updator({}), null, 2) + '\n');
    reporter.push({ message: 'create', file: at });
  }
};

export default updateJSONFile;
