import * as fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
const execAsync = promisify(exec);
import isDependencyInstalled from '../utilities/isDependencyInstalled';
import Reporter from '../Reporter';
import InstallDependencyInfo from '../instructions/InstallDependencyInfo';

const realInstallDependency = async (
  pkgFilePath: string,
  pkgName: string,
  version: string,
  dev: boolean
) => {
  const obj = await execAsync(
    ['npm', 'install', pkgName + '@' + version, dev ? '--save-dev' : '--save'].join(' ')
  );
  if (obj.stderr) {
    process.stderr.write(obj.stderr);
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
  const { version, dev, mock, wd } = params;
  const [installed, pkgFilePath] = isDependencyInstalled(wd as string, packageName, dev || false);
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
      mockInstallDependency(pkgFilePath, packageName, version, dev || false);
    } else {
      await realInstallDependency(pkgFilePath, packageName, version, dev || false);
    }
  }
};

export default installDependency;
