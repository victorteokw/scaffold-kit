import Executable from '../Executable';
import silentReporter from '../reporters/silentReporter';

const acceptSilent: Executable = async (ctx, next) => {
  ctx.optionDefinitions.silent = {
    type: 'boolean',
    desc: 'suppresses output.',
    default: false,
    save: false
  };
  await next(ctx);
  if (ctx.options.silent) {
    ctx.reporter = silentReporter;
  }
};

export default acceptSilent;
