import * as path from 'path';
import findDominantFile from 'find-dominant-file';

const isDependencyInstalled = (wd: string, pkgName: string, dev: boolean): [boolean, string] => {
  const pkgFilePath = findDominantFile(wd, 'package.json', false);
  if (!pkgFilePath) {
    return [false, path.join(wd, 'package.json')];
  }
  const pkgJson = require(pkgFilePath);
  const section = dev ? pkgJson.devDependencies : pkgJson.dependencies;
  return [!!(section && section[pkgName]), pkgFilePath];
};

export default isDependencyInstalled;
