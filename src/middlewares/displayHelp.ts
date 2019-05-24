// If options.help, display help and exit

import Executable from '../Executable';
import ensureNewLine from '../utilities/ensureNewLine';
import isDefined from '../utilities/isDefined';
import { Writable } from 'stream';

const displayHelp:
(help: string, stream?: Writable) => Executable =
(help: string, stream: Writable = process.stdout) => {
  return async (ctx, next) => {
    if (isDefined(ctx.options.help)) {
      stream.write(ensureNewLine(help));
    } else {
      await next(ctx);
    }
  }
}

export default displayHelp;
