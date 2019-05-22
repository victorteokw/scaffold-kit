// Automatically saves loadable options

import Executable from '../Executable';

const useConfigFile: (fileName: string) => Executable = (fileName: string) => {
  return async (ctx, next) => {
    // before executing
    // read from config file
    await next(ctx);
    // after executing
    // update config file
  }
}

export default useConfigFile;
