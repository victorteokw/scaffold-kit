// Assign option definitions to the context

import Executable from '../Executable';
import OptionRules from '../OptionRules';

const defineOptions: (defs: OptionRules) => Executable =
(defs: OptionRules) => async (ctx, next) => {
  const keys = Object.keys(defs);
  for (const key of keys) {
    ctx.optionDefinitions[key] = defs[key];
  }
  await next(ctx);
}

export default defineOptions;
