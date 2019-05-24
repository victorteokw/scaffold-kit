// If options.version, display version and exit

import Executable from '../Executable';
import ensureNewLine from '../utilities/ensureNewLine';
import isDefined from '../utilities/isDefined';
import { Writable } from 'stream';

const displayVersion:
(version: string, stream?: Writable) => Executable =
(version: string, stream: Writable = process.stdout) => {
  return async (ctx, next) => {
    if (isDefined(ctx.options.version)) {
      stream.write(ensureNewLine(version));
    } else {
      await next(ctx);
    }
  }
}

export default displayVersion;
