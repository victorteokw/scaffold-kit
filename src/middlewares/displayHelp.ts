// If options.help, display help and exit

import Executable from '../Executable';
import ensureNewLine from '../utilities/ensureNewLine';
import isDefined from '../utilities/isDefined';

const displayHelp: (help: string) => Executable = (help: string) => {
  return async (ctx, next) => {
    if (isDefined(ctx.options.help)) {
      process.stdout.write(ensureNewLine(help));
    } else {
      await next(ctx);
    }
  }
}

export default displayHelp;
