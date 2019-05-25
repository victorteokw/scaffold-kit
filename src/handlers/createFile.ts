import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as ejs from 'ejs';
import {isUndefined} from 'lodash';
import CreateFileInfo from '../instructions/CreateFileInfo';

export default function createFile({
  content,
  from,
  at,
  context,
  overwrite,
}: CreateFileInfo) {
  if (isUndefined(content) && from) {
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
      return ['up-to-date', 'yellow', at];
    } else {
      if (overwrite) {
        // overwrite
        fs.writeFileSync(dest, content);
        return ['overwrite', 'green', at];
      } else {
        // jsut errors
        return ['exist', 'red', at];
      }
    }
  } else {
    // create file
    mkdirp.sync(path.dirname(dest));
    fs.writeFileSync(dest, content);
    return ['create', 'green', at];
  }
}
