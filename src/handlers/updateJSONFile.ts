import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import {isEqual,cloneDeep} from  'lodash';

export default function updateJSONFile  ({ at, updator, silent })  {
  const dest = at;
  if (fs.existsSync(dest)) {
    const before = JSON.parse(fs.readFileSync(dest).toString());
    const after = updator(cloneDeep(before));
    if (isEqual(before, after)) {
      return ['up-to-date', 'yellow', at, silent];
    } else {
      fs.writeFileSync(at, JSON.stringify(after, null, 2) + '\n');
      return ['update', 'green', at, silent];
    }
  } else {
    mkdirp.sync(path.dirname(dest));
    fs.writeFileSync(at, JSON.stringify(updator({}), null, 2) + '\n');
    return ['create', 'green', at, silent];
  }
};
