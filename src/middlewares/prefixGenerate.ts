// Ignore the 'generate' token if it's the first token
// This is for implementing Ruby on Rails style generator

import Executable from '../Executable';

const prefixGenerate: Executable = async (ctx, next) => {
  const arg0 = ctx.args[0];
  if (arg0 === 'generate') {
    ctx.args.splice(0, 1);
  }
  await next(ctx);
}

export default prefixGenerate;
