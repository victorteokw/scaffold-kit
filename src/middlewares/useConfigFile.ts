// Automatically saves loadable options

import loadFile from 'load-any-file';
import * as path from 'path';
import writeFile from 'write-any-file';
import Executable from '../Executable';
import Options from '../Options';
import isDefined from '../utilities/isDefined';
import mapValues from '../utilities/mapValues';

const useConfigFile: (fileName: string) => Executable = (fileName: string) => {
  return async (ctx, next) => {
    // before executing
    // read from config file
    const configFileName = path.join(ctx.wd, fileName);
    let configFile: string | undefined;
    let originalSavedOptions: Options = {};
    try {
      configFile = loadFile.resolve(configFileName);
    } catch(e) {
      configFile = undefined;
    }
    if (configFile) {
      originalSavedOptions = loadFile(configFile);
      ctx.savedOptions = Object.freeze(Object.assign({}, originalSavedOptions));
    }
    await next(ctx);
    // after executing
    // update config file
    const currentOptions = ctx.options;
    const currentDefinitions = ctx.optionDefinitions;
    const defaultValues = mapValues(currentDefinitions, (r) => r.default);
    const savableStatus = mapValues(currentDefinitions, (r) => r.save);
    const optionKeys = Object.keys(currentOptions);
    for (const key of optionKeys) {
      if (savableStatus[key]) {
        if (originalSavedOptions[key] === currentOptions[key]) {
          // do nothing
        } else {
          if (!isDefined(originalSavedOptions[key])) {
            if (defaultValues[key] === currentOptions[key]) {
              // do nothing because it's default
            } else {
              // add here
              originalSavedOptions[key] = currentOptions[key];
            }
          } else {
            if (currentOptions[key] === defaultValues[key]) {
              // remove here
              delete originalSavedOptions[key];
            } else {
              // update here
              originalSavedOptions[key] = currentOptions[key];
            }
          }
        }
      } else {
        // it was saved, maybe due to scaffold tool update, should remove anyhow
        if (originalSavedOptions[key]) {
          delete originalSavedOptions[key];
        }
      }
    }
    writeFile(originalSavedOptions, configFile || `${configFileName}.json`);
  }
}

export default useConfigFile;
