import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child-process-promise';
import findDominantFile from 'find-dominant-file';
import Reporter from '../Reporter';
import InstallDependencyInfo from '../instructions/InstallDependencyInfo';

const isDependencyInstalled = (wd: string, pkgName: string, dev: boolean) => {
  const pkgFilePath = findDominantFile(wd, 'package.json', false);
  if (!pkgFilePath) {
    return false;
  }
  const pkgJson = require(pkgFilePath);
  const section = dev ? pkgJson.devDependencies : pkgJson.dependencies;
  return !!(section && section[pkgName]);
};

const realInstallDependency = async (
  pkgFilePath: string,
  pkgName: string,
  version: string,
  dev: boolean
) => {
  try {
    spawn(
      'npm',
      ['install', pkgName + '@' + version, dev ? '--save-dev' : '--save'],
      { capture: [ 'stdout', 'stderr' ]}
    );
  } catch(e) {
    console.error(e.stderr);
  }
}

const mockInstallDependency = (
  pkgFilePath: string,
  pkgName: string,
  version: string,
  dev: boolean
) => {
  if (!fs.existsSync(pkgFilePath)) {
    fs.writeFileSync(
      pkgFilePath,
      JSON.stringify(
        {
          dependencies: {},
          devDependencies: {},
        },
        null,
        2,
      ) + '\n',
    );
  }
  const pkg = require(pkgFilePath);
  if (!pkg.dependencies) {
    pkg.dependencies = {};
  }
  if (!pkg.devDependencies) {
    pkg.devDependencies = {};
  }
  pkg[dev ? 'devDependencies' : 'dependencies'][pkgName] = version;
  fs.writeFileSync(pkgFilePath, JSON.stringify(pkg, null, 2) + '\n');
};

const installDependency = async (
  params: InstallDependencyInfo,
  reporter: Reporter
) => {
  const packageName = params.package;
  const { version, dev, mock } = params;
  const installed = isDependencyInstalled('', packageName, dev || false);
  if (installed) {
    reporter.push({
      message: 'installed',
      dependency: packageName
    });
  } else {
    reporter.push({
      message: 'install',
      dependency: packageName
    });
    if (mock) {
      mockInstallDependency('', packageName, version, dev || false);
    } else {
      realInstallDependency('', packageName, version, dev || false);
    }
  }
};

export default installDependency;
