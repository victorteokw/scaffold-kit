import Executable from '../Executable';

const acceptHelp: Executable = async (ctx, next) => {
  ctx.optionDefinitions.help = {
    type: 'boolean',
    alias: 'h',
    desc: "display help and exit.",
    default: false,
    save: false
  };
  await next(ctx);
  if (ctx.options.help) {
    ctx.helpMode = true;
  }
}

export default acceptHelp;
