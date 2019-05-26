import * as fs from 'fs';
import Reporter from '../Reporter';
import DeleteFileInfo from '../instructions/DeleteFileInfo';

const deleteFile = (params: DeleteFileInfo, reporter: Reporter) => {
  const { at } = params;
  if (fs.existsSync(at)) {
    // delete file
    fs.unlinkSync(at);
    reporter.push({ message: 'delete', file: at });
  } else {
    // do nothing
    reporter.push({ message: 'not exist', file: at });
  }
};

export default deleteFile;
