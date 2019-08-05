import Executable from '../Executable';

const acceptMockInstall: Executable = async (ctx, next) => {
  ctx.optionDefinitions.mockInstall = {
    type: 'boolean',
    desc: 'update dependency list without installing.',
    default: false,
    save: false
  };
  await next(ctx);
  if (ctx.options.mockInstall) {
    ctx.mockInstall = true;
  }
};

export default acceptMockInstall;
