import * as fs from 'fs';
import Reporter from '../Reporter';
import DeleteFileInfo from '../instructions/DeleteFileInfo';
import isDefined from '../utilities/isDefined';

const deleteFile = (params: DeleteFileInfo, reporter: Reporter) => {
  let { at } = params;
  if (!isDefined(at)) {
    throw new Error(
      `You should provide the path to delete the file, the current path:'${at}'.`,
    );
  }
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
