import * as fs from 'fs';;
import * as path from 'path';
import {isEqual} from  'lodash';

export default function rollbackFile  ({ at, rollbacker, silent }) {
  const dest = at;
  if (fs.existsSync(dest)) {
    const before = fs.readFileSync(dest).toString();
    const after = rollbacker(before);
    if (isEqual(before, after)) {
      return ['unchanged', 'yellow', at, silent];
    } else {
      fs.writeFileSync(at, after);
      return ['rollback', 'green', at, silent];
    }
  } else {
    // file not exist, can not rollback
    return ['not exist', 'red', at, silent];
  }
};
