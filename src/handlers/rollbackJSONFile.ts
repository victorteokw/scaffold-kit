import * as fs from 'fs';
import { isEqual, cloneDeep } from 'lodash';
import RollbackJSONFileInfo from '../instructions/RollbackJSONFileInfo';
import Reporter from '../Reporter';

const rollbackJSONFile = (params: RollbackJSONFileInfo, reporter: Reporter) => {
  const { at, rollbacker } = params;
  if (fs.existsSync(at)) {
    const before = JSON.parse(fs.readFileSync(at).toString());
    const after = rollbacker(cloneDeep(before));
    if (isEqual(before, after)) {
      reporter.push({ message: 'unchanged', file: at });
    } else {
      fs.writeFileSync(at, JSON.stringify(after, null, 2) + '\n');
      reporter.push({ message: 'rollback', file: at });
    }
  } else {
    // file not exist, can not rollback
    reporter.push({ message: 'not exist', file: at });
  }
};

export default rollbackJSONFile;
