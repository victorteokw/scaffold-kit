import Executable from '../Executable';

const removeFirstArg: Executable = async (ctx, next) => {
  if (ctx.args[0]) {
    ctx.args.shift();
  }
  await next(ctx);
}

export default removeFirstArg;
