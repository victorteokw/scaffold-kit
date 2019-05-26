import * as fs from 'fs';
import * as path from 'path';
import isDefined from '../utilities/isDefined';
import * as mkdirp from 'mkdirp';
import Reporter from '../Reporter';
import AppendFileInfo from '../instructions/AppendFileInfo';
import Render from '../Render';

const appendFile = (
  params: AppendFileInfo,
  reporter: Reporter,
  render: Render,
) => {
  const { from, at, context } = params;
  let { content } = params;

  if (!isDefined(content)) {
    content = fs.readFileSync(from as string).toString();
  }
  if (context) {
    content = render(content as string, context);
  }
  if (fs.existsSync(at)) {
    const destContent = fs.readFileSync(at).toString();
    if (destContent.endsWith(content as string)) {
      // never mind, don't need to append anymore
      reporter.push({ message: 'up-to-date', file: at });
    } else {
      // do the append
      fs.appendFileSync(at, content);
      reporter.push({ message: 'append', file: at });
    }
  } else {
    // create file
    mkdirp.sync(path.dirname(at));
    fs.writeFileSync(at, content);
    reporter.push({ message: 'create', file: at });
  }
};

export default appendFile;
