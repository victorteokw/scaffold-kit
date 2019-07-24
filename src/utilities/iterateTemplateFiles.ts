import * as path from 'path';
import * as glob from 'glob';
import deunderbar from './deunderbar';

interface IterateFileParameter {
  templateName: string,
  filename: string
}

const iterateTemplateFiles = (
  dir: string,
  callback: (param: IterateFileParameter) => void
) => {
  const files = glob.sync(path.join(dir, '**/*'), { dot: true, nodir: true });
  files.forEach((file: string) => {
    const templateName = path.relative(dir, file);
    const filename = deunderbar(templateName);
    callback({ templateName, filename });
  });
};

export default iterateTemplateFiles;
