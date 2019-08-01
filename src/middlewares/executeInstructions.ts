// Execute the instructions and mark the executor as flushed

import Executable from '../Executable';

const executeInstructions: Executable = async (ctx, next) => {
  if (!ctx.disableFlush) {
    await ctx.executor.flush(ctx.reporter);
  }
  await next(ctx);
}

export default executeInstructions;
