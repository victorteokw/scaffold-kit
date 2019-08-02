import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child-process-promise';
import isDependencyInstalled from '../utilities/isDependencyInstalled';
import Reporter from '../Reporter';
import InstallDependencyInfo from '../instructions/InstallDependencyInfo';

const mockRemoveDependency = (
  pkgFilePath: string,
  pkgName: string,
  version: string,
  dev: boolean
) => {
  if (!fs.existsSync(pkgFilePath)) {
    return;
  }
  const pkg = require(pkgFilePath);
  if (!dev) {
    if (pkg.dependencies && pkg.dependencies[pkgName]) {
      delete pkg.dependencies[pkgName];
    }
  } else {
    if (pkg.devDependencies && pkg.devDependencies[pkgName]) {
      delete pkg.devDependencies[pkgName];
    }
  }
  fs.writeFileSync(pkgFilePath, JSON.stringify(pkg, null, 2) + '\n');
};

const realRemoveDependency = async (
  pkgFilePath: string,
  pkgName: string,
  version: string,
  dev: boolean
) => {
  try {
    spawn(
      'npm',
      ['remove', pkgName],
      { capture: [ 'stdout', 'stderr' ]}
    );
  } catch(e) {
    console.error(e.stderr);
  }
}

const removeDependency = async (
  params: InstallDependencyInfo,
  reporter: Reporter
) => {
  const packageName = params.package;
  const { version, dev, mock } = params;
  const installed = isDependencyInstalled('', packageName, dev || false);
  if (installed) {
    reporter.push({
      message: 'remove',
      dependency: packageName
    });
    if (mock) {
      mockRemoveDependency('', packageName, version, dev || false);
    } else {
      realRemoveDependency('', packageName, version, dev || false);
    }
  } else {
    reporter.push({
      message: 'uninstalled',
      dependency: packageName
    });
  }
};

export default removeDependency;
