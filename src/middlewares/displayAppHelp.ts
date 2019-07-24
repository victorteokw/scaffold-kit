// If options.help, display help and exit

import { title, body, options } from "type-args-usage";
import { Writable } from 'stream';
import Executable from '../Executable';
import ensureNewLine from '../utilities/ensureNewLine';
import isFalsy from '../utilities/isFalsy';
import chalk from "chalk";

interface AppHelpInfo {
  displayName: string,
  commandName: string,
  usage?: string,
  description: string,
  version: string
}

const displayAppHelp:
(help: AppHelpInfo, stream?: Writable) => Executable =
(help: AppHelpInfo, stream: Writable = process.stdout) => {
  return async (ctx, next) => {
    if (!isFalsy(ctx.options.help)) {
      let retval = '';
      retval += title(help.displayName + ' ' + help.version);
      retval += body(help.description, 2, 2);
      retval += title('Usage');
      retval += body(help.usage || `${help.commandName} ${chalk.italic('command')} [options...]`, 2, 2);
      retval += title('Options');
      retval += options(ctx.optionDefinitions, 2);
      stream.write(ensureNewLine(retval));
    } else {
      await next(ctx);
    }
  }
}

export default displayAppHelp;
