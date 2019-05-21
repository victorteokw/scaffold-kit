// Redirect working directory specified by the first argument
// If the argument is not exist, then do not redirect
// ctx.wd is modified, however, process.cwd() is not modified

import * as path from 'path';
import Executable from '../Executable';
import isDefined from '../utilities/isDefined';

const redirectWorkingDirectory: Executable = async (ctx, next) => {
  const arg0 = ctx.args[0];
  if (isDefined(arg0)) {
    ctx.wd = path.resolve(ctx.wd, arg0);
    ctx.args.splice(0, 1);
  }
  await next(ctx);
}

export default redirectWorkingDirectory;
