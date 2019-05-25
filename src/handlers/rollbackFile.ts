import * as fs from 'fs';
import { isEqual } from 'lodash';
import RollbackFileInfo from '../instructions/RollbackFileInfo';
import Reporter from '../Reporter';

const rollbackFile = (params: RollbackFileInfo, reporter: Reporter) => {
  let { at, rollbacker } = params;

  if (fs.existsSync(at)) {
    const before = fs.readFileSync(at).toString();
    const after = rollbacker(before);
    if (isEqual(before, after)) {
      reporter.push({ message: 'unchanged', file: at });
    } else {
      fs.writeFileSync(at, after);
      reporter.push({ message: 'rollback', file: at });
    }
  } else {
    // file not exist, can not rollback
    reporter.push({ message: 'not exist', file: at });
  }
};

export default rollbackFile;
