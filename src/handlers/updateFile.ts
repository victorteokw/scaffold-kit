import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import { isEqual } from 'lodash';

export default function updateFile({ at, updator, silent }) {
  const dest = at;
  if (fs.existsSync(dest)) {
    const before = fs.readFileSync(dest).toString();
    const after = updator(before);
    if (isEqual(before, after)) {
      return ['up-to-date', 'yellow', at, silent];
    } else {
      fs.writeFileSync(at, after);
      return ['update', 'green', at, silent];
    }
  } else {
    mkdirp.sync(path.dirname(dest));
    fs.writeFileSync(at, updator(''));
    return ['create', 'green', at, silent];
  }
}
