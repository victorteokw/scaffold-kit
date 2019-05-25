import * as fs from 'fs';
import * as ejs from 'ejs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import Reporter from '../Reporter';
import isDefined from '../utilities/isDefined';
import CreateFileInfo from '../instructions/CreateFileInfo';

const createFile = (params: CreateFileInfo, reporter: Reporter) => {
  let { content, from, at, context, overwrite } = params;
  if (!isDefined && from) {
    content = fs.readFileSync(from).toString();
  }
  if (context) {
    content = ejs.render(content, context);
  }
  const dest = at;
  if (fs.existsSync(dest)) {
    const destContent = fs.readFileSync(dest).toString();
    if (destContent === content) {
      // never mind, same content
      reporter.push({ message: 'up-to-date', file: at });
    } else {
      if (overwrite) {
        // overwrite
        fs.writeFileSync(dest, content);
        reporter.push({ message: 'overwrite', file: at });
      } else {
        // jsut errors
        reporter.push({ message: 'exist', file: at });
      }
    }
  } else {
    // create file
    mkdirp.sync(path.dirname(dest));
    fs.writeFileSync(dest, content);
    reporter.push({ message: 'create', file: at });
  }
};

export default createFile;
