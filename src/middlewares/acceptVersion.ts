import Executable from '../Executable';

const acceptVersion: Executable = async (ctx, next) => {
  ctx.optionDefinitions.version = {
    type: 'boolean',
    alias: 'v',
    desc: "display version and exit.",
    default: false,
    save: false
  };
  await next(ctx);
}

export default acceptVersion;
