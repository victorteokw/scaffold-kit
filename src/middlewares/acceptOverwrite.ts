import Executable from '../Executable';

const acceptOverwrite: Executable = async (ctx, next) => {
  ctx.optionDefinitions.overwrite = {
    type: 'boolean',
    desc: 'overwrite existing files.',
    default: false,
    save: false
  };
  await next(ctx);
  if (ctx.options.overwrite) {
    ctx.overwrite = true;
  }
};

export default acceptOverwrite;
