import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import isDefined from '../utilities/isDefined';
import CreateFileInfo from '../instructions/CreateFileInfo';
import Reporter from '../Reporter';
import Render from '../Render';

const createFile = (
  params: CreateFileInfo,
  reporter: Reporter,
  render: Render
) => {
  let { content } = params;
  const { from, at, context, overwrite } = params;
  if (!isDefined(from) && !isDefined(content)) {
    throw new Error(`you should provide content or from for '${params.at}'.`);
  }
  if (!isDefined(content)) {
    content = fs.readFileSync(from as string).toString();
  }
  if (context) {
    content = render(content as string, context);
  }
  if (fs.existsSync(at)) {
    const destContent = fs.readFileSync(at).toString();
    if (destContent === content) {
      // never mind, same content
      reporter.push({ message: 'up-to-date', file: at });
    } else {
      if (overwrite) {
        // overwrite
        fs.writeFileSync(at, content);
        reporter.push({ message: 'overwrite', file: at });
      } else {
        // jsut errors
        reporter.push({ message: 'exist', file: at });
      }
    }
  } else {
    // create file
    mkdirp.sync(path.dirname(at));
    fs.writeFileSync(at, content);
    reporter.push({ message: 'create', file: at });
  }
};

module.exports = createFile;
