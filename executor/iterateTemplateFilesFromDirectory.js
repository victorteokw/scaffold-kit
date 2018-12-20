const path = require('path');
const glob = require('glob');
const each = require('lodash/each');

const deunderbar = (filename) => {
  if (path.basename(filename) === filename) {
    return filename.replace(/^_/, '');
  } else {
    return path.join(
      path.dirname(filename),
      path.basename(filename).replace(/^_/, '')
    );
  }
};

const iterateTemplateFilesFromDirectory = (dir, callback) => {
  const files = glob.sync(path.join(dir, '**/*'), { dot: true, nodir: true });
  each(files, (file) => {
    const templateName = path.relative(dir, file);
    const filename = deunderbar(templateName);
    callback({ templateName, filename });
  });
};

module.exports = iterateTemplateFilesFromDirectory;
