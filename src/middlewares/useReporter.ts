// Automatically saves loadable options

import Executable from '../Executable';
import Reporter from '../Reporter';

const useReporter: (reporter: Reporter) => Executable =
(reporter: Reporter) => {
  return async (ctx, next) => {
    ctx.reporter = reporter;
    await next(ctx);
  }
}

export default useReporter;
