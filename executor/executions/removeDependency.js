const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const getDestination = require('../getDestination');
const outputMessage = require('./outputMessage');

const isDependencyInstalled = (pkgName, dev) => {
  const pkgFile = path.join(getDestination(), 'package.json');
  const pkg = require(pkgFile);
  const section = dev ? pkg.devDependencies : pkg.dependencies;
  return !!section[pkgName];
};

const mockRemoveDependency = (pkgName, dev) => {
  const pkgFile = path.join(getDestination(), 'package.json');
  const pkg = require(pkgFile);
  delete pkg[dev ? 'devDependencies' : 'dependencies'][pkgName];
  fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + '\n');
};

const realRemoveDependency = (pkgName) => {
  const obj = spawnSync('npm', ['remove', pkgName]);
  if (obj.signal === 'SIGINT') {
    console.log('');
    process.exit(0);
  }
};

const removeDependency = (params) => {
  const pkgName = params.package;
  const { dev, mock, silent } = params;
  const installed = isDependencyInstalled(pkgName, dev);
  if (installed) {
    outputMessage('remove', 'green', pkgName, silent);
    if (mock) {
      mockRemoveDependency(pkgName, dev);
    } else {
      realRemoveDependency(pkgName);
    }
  } else {
    outputMessage('uninstalled', 'yellow', pkgName, silent);
  }
};

module.exports = removeDependency;
