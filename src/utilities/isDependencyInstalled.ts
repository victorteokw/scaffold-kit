import findDominantFile from 'find-dominant-file';

const isDependencyInstalled = (wd: string, pkgName: string, dev: boolean) => {
  const pkgFilePath = findDominantFile(wd, 'package.json', false);
  if (!pkgFilePath) {
    return false;
  }
  const pkgJson = require(pkgFilePath);
  const section = dev ? pkgJson.devDependencies : pkgJson.dependencies;
  return !!(section && section[pkgName]);
};

export default isDependencyInstalled;
