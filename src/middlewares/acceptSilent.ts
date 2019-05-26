import Executable from '../Executable';
import silentReporter from '../reporters/silentReporter';

const acceptSilent: Executable = async (ctx, next) => {
  if (ctx.options.silent) {
    ctx.reporter = silentReporter;
  }
  await next(ctx);
};

export default acceptSilent;
