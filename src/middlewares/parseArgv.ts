// Automatically saves loadable options

import Executable from '../Executable';
import { parse } from 'type-args';

const parseArgv: Executable = async (ctx, next) => {
  const [options, args] = parse(
    process.argv,
    ctx.optionDefinitions,
    ctx.savedOptions
  );
  ctx.args = args;
  ctx.options = options;
  await next(ctx);
}

export default parseArgv;
