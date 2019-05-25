import * as fs from 'fs';
import * as ejs from 'ejs';
import isDefined from '../utilities/isDefined';

export default function detachFromFile({ content, from, at, context, silent }) {
  if (!isDefined(content)) {
    content = fs.readFileSync(from).toString();
  }
  if (context) {
    content = ejs.render(content, context);
  }
  const dest = at;
  if (fs.existsSync(dest)) {
    const destContent = fs.readFileSync(dest).toString();
    if (destContent.endsWith(content)) {
      // remove content from the bottom
      fs.truncateSync(dest, destContent.indexOf(content));
      return ['truncate', 'green', at, silent];
    } else {
      // cannot remove content
      return ['not detachable', 'red', at, silent];
    }
  } else {
    // file not exist, how to detach content?
    return ['not exist', 'yellow', at, silent];
  }
}
