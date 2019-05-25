import * as path from 'path';

const deunderbar = (filename: string): string => {
  if (path.basename(filename) === filename) {
    return filename.replace(/^_/, '');
  } else {
    return path.join(
      path.dirname(filename),
      path.basename(filename).replace(/^_/, '')
    );
  }
};

export default deunderbar;
