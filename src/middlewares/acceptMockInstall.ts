import Executable from '../Executable';

const acceptMockInstall: Executable = async (ctx, next) => {
  if (ctx.options.mockInstall) {
    ctx.mockInstall = true;
  }
  await next(ctx);
};

export default acceptMockInstall;
