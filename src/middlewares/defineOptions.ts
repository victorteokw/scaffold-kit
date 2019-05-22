// Assign option definitions to the context

import Executable from '../Executable';
import Options from '../Options';

const defineOptions: (defs: Options) => Executable = (defs: Options) => {
  return async (ctx, next) => {
    const keys = Object.keys(defs);
    for (const key of keys) {
      ctx.optionDefinitions[key] = defs[key];
    }
    await next(ctx);
  }
}

export default defineOptions;
