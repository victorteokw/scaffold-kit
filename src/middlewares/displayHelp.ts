// If options.help, display help and exit

import { Writable } from 'stream';
import { title, body, options } from "type-args-usage";
import Executable from '../Executable';
import isFalsy from '../utilities/isFalsy';

const displayHelp = (stream: Writable = process.stdout): Executable => {
  return async (ctx, next) => {
    if (isFalsy(ctx.helpMode)) {
      await next(ctx);
    }
    const formattedSections = ctx.helpSections.map((section) => {
      return title(section.title) + body(section.content, 2, 2);
    });
    if (Object.keys(ctx.optionDefinitions).length > 0) {
      formattedSections.push(
        title('Options') + options(ctx.optionDefinitions, 2)
      );
    }
    stream.write(formattedSections.join('') + '\n');
  }
}

export default displayHelp;
