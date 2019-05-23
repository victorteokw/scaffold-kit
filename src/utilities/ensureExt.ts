import * as path from 'path';

function ensureExt(filename: string): string {
  if (path.extname(filename).length < 2) {
    return filename + '.json';
  } else {
    return filename;
  }
};
export default ensureExt;
