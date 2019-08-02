// Seeking the project root directory
// process.cwd() is not modified

import findDominantFile from 'find-dominant-file';
import Executable from '../Executable';

type SeekingProjectRoot = (dominant?: string | string[]) => Executable;

const seekingProjectRoot: SeekingProjectRoot =
  (dominant: string | string[] = 'package.json') => {
  return async (ctx, next) => {
    const located = findDominantFile(ctx.wd, dominant, true);
    if (located) ctx.wd = located;
    process.chdir(ctx.wd);
    await next(ctx);
  }
}

export default seekingProjectRoot;
