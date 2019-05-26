import * as fs from 'fs';
import isDefined from '../utilities/isDefined';
import Render from '../Render';
import Reporter from '../Reporter';
import DetachFromFileInfo from '../instructions/DetachFromFileInfo';

const detachFromFile = (
  params: DetachFromFileInfo,
  reporter: Reporter,
  render: Render
) => {
  let { content } = params;
  const { from, at, context } = params;

  if (!isDefined(content)) {
    content = fs.readFileSync(from as string).toString();
  }

  if (context) {
    content = render(content as string, context);
  }

  if (fs.existsSync(at)) {
    const destContent = fs.readFileSync(at).toString();
    if (destContent.endsWith(content as string)) {
      // remove content from the bottom
      fs.truncateSync(at, destContent.indexOf(content as string));
      reporter.push({ message: 'truncate', file: at });
    } else {
      // cannot remove content
      reporter.push({ message: 'not detachable', file: at });
    }
  } else {
    reporter.push({ message: 'not exist', file: at });
  }
};

export default detachFromFile;
