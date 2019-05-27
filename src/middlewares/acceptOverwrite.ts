import Executable from '../Executable';

const acceptOverwrite: Executable = async (ctx, next) => {
  if (ctx.options.overwrite) {
    ctx.overwrite = true;
  }
  await next(ctx);
};

export default acceptOverwrite;
