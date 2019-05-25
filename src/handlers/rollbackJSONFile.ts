import * as fs from 'fs';
import * as path from 'path';
import { isEqual, cloneDeep } from 'lodash';

const rollbackJSONFile = ({ at, rollbacker, silent }) => {
  const dest = at;
  if (fs.existsSync(dest)) {
    const before = JSON.parse(fs.readFileSync(dest).toString());
    const after = rollbacker(cloneDeep(before));
    if (isEqual(before, after)) {
      return ['unchanged', 'yellow', at, silent];
    } else {
      fs.writeFileSync(at, JSON.stringify(after, null, 2) + '\n');
      return ['rollback', 'green', at, silent];
    }
  } else {
    // file not exist, can not rollback
    return ['not exist', 'red', at, silent];
  }
};

export default rollbackJSONFile;
