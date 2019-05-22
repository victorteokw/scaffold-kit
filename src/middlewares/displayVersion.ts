// If options.version, display version and exit

import Executable from '../Executable';
import ensureNewLine from '../utilities/ensureNewLine';
import isDefined from '../utilities/isDefined';

const displayVersion: (version: string) => Executable = (version: string) => {
  return async (ctx, next) => {
    if (isDefined(ctx.options.version)) {
      process.stdout.write(ensureNewLine(version));
    } else {
      await next(ctx);
    }
  }
}

export default displayVersion;
