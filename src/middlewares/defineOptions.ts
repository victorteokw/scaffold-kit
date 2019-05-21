// Assign option definitions to the context

import * as path from 'path';
import Executable from '../Executable';

const defineOptions: (defs: object) => Executable = (defs: object) => {
  return async (ctx, next) => {
    const keys = Object.keys(defs);
    for (const key of keys) {
      ctx.optionDefinitions[key] = defs[key];
    }
    await next(ctx);
  }
}

export default defineOptions;
