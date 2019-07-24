// When the 'destroy' token is appeared as the first token,
// Reverse the instructions.

import Executable from '../Executable';
import reverseInstruction from '../reverseInstruction';

const prefixDestroy: Executable = async (ctx, next) => {
  const arg0 = ctx.args[0];
  if (arg0 === 'destroy') {
    ctx.args.splice(0, 1);
  }
  await next(ctx);
  if (arg0 === 'destroy') {
    ctx.executor.instructions = ctx.executor.instructions.reverse().map(reverseInstruction);
  }
}

export default prefixDestroy;
