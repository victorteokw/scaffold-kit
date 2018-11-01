const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const { spawnSync } = require('child_process');
const ejs = require('ejs');
const clone = require('lodash/cloneDeep');

const instRegistry = require('./instRegistry');
const getDestination = require('./getDestination');
const { getExecutorOptions } = require('./executorOptions');
const outputMessage = require('./outputMessage');

const executeAllInstructions = () => {
  const executionCommands = convertCommandsToExecutionCommands(instRegistry.getAll());
  execute(executionCommands);
};

const executeFileCommandsAndOutputMessage = (target, commands, destDir) => {
  let flag, flagColor;
  commands.forEach((command) => {
    const key = Object.keys(command)[0];
    command = command[key];
    command[key] = true;
    if (command.createFile) {
      mkdirp.sync(path.dirname(target));
      const content = command.content === undefined ? fs.readFileSync(command.from).toString() : command.content;
      const rendered = ejs.render(content, command.context || {});
      if (fs.existsSync(target)) {
        if (fs.readFileSync(target).toString() === rendered) {
          flag = 'up-to-date';
          flagColor = 'green';
        } else {
          flag = 'exist';
          flagColor = 'yellow';
        }
      } else {
        fs.writeFileSync(target, rendered);
        flag = 'create';
        flagColor = 'green';
      }
    } else if (command.appendFile) {
      mkdirp.sync(path.dirname(target));
      const content = command.content || fs.readFileSync(command.from).toString();
      const rendered = ejs.render(content, command.context || {});
      if (fs.readFileSync(target).toString().includes(rendered)) {
        flag = 'up-to-date';
        flagColor = 'green';
      } else {
        fs.appendFileSync(target, rendered);
        if (!flag) {
          flag = 'append';
          flagColor = 'green';
        }
      }
    } else if (command.deleteFile) {
      if (fs.existsSync(target)) {
        fs.unlinkSync(target);
        flag = 'delete';
        flagColor = 'green';
      } else {
        flag = 'not exist';
        flagColor = 'yellow';
      }
    } else if (command.updateJSONFile) {
      let original;
      if (fs.existsSync(target)) {
        original = fs.readFileSync(target).toString();
      } else {
        original = '';
        if (!flag) {
          flag = 'create';
          flagColor = 'green';
        }
      }
      updateJSONFile(target, command.updator);
      const currentVal = fs.existsSync(target);
      if (!flag) {
        if (original === currentVal) {
          flag = 'up-to-date';
          flagColor = 'green';
        } else {
          flag = 'update';
          flagColor = 'green';
        }
      }
    }
  });
  outputMessage(flag, flagColor, path.relative(destDir, target));
};

const executeDependencyCommandAndOutputMessage = (dep, command, destDir) => {
  let flag, flagColor;
  if (command.command === 'install') {
    const pkgFile = path.join(destDir, 'package.json');
    const pkg = require(pkgFile);
    if (command.dev ? pkg.devDependencies[dep] : pkg.dependencies[dep]) {
      flag = 'installed';
      flagColor = 'green';
      outputMessage(flag, flagColor, dep);
    } else {
      if (command.mock) {
        updateJSONFile(pkgFile, (j) => {
          j[command.dev ? 'devDependencies' : 'dependencies'][dep] = command.version;
          return j;
        });
        flag = 'install';
        flagColor = 'green';
        outputMessage(flag, flagColor, dep);
      } else {
        if (command.mock) {
          updateJSONFile(pkgFile, (j) => {
            if (j.devDependencies) {
              delete j['devDependencies'][dep];
            }
            if (j.dependencies) {
              delete j['dependencies'][dep];
            }
            return j;
          });
        } else {
          flag = 'install';
          flagColor = 'green';
          outputMessage(flag, flagColor, dep);
          const obj = spawnSync('npm', ['install', dep + '@' + command.version, command.dev ? '--save-dev' : '--save']);
          if (obj.signal === 'SIGINT') {
            console.log('');
            process.exit(0);
          }
        }
      }
    }
  } else if (command.command === 'remove') {
    flag = 'remove';
    flagColor = 'green';
    outputMessage(flag, flagColor, dep);
    const obj = spawnSync('npm', ['remove', dep]);
    if (obj.signal === 'SIGINT') {
      console.log('');
      process.exit(0);
    }
  } else {
    throw `Unknown dependency command '${command.command}'`;
  }
};

const execute = (executionCommands, destDir) => {
  const filesMap = executionCommands.files;
  Object.keys(filesMap).sort().forEach((filename) => {
    const target = path.join(destDir, filename);
    const commands = filesMap[filename];
    executeFileCommandsAndOutputMessage(target, commands, destDir);
  });
  const dependenciesMap = executionCommands.dependencies;
  Object.keys(dependenciesMap).sort().forEach((dep) => {
    const command = dependenciesMap[dep];
    executeDependencyCommandAndOutputMessage(dep, command, destDir);
  });
  const shellCommandsList = executionCommands.shellCommands;
  shellCommandsList.forEach((command) => {
    executeShellCommandAndOutputMessage(command, destDir);
  });
};

const executeShellCommandAndOutputMessage = (command, _destDir) => {
  runShellCommand(command);
};

const convertCommandsToExecutionCommands = (commands, destDir) => {
  const filesMap = {};
  const dependenciesMap = {};
  const shellCommandsList = [];
  commands.forEach((command) => {
    const commandName = Object.keys(command)[0];
    const commandParams = command[commandName];
    if (commandName === 'createFile') {
      filesMap[commandParams.at] = [{
        'createFile': {
          from: commandParams.from,
          content: commandParams.content,
          context: commandParams.context
        }
      }];
    } else if (commandName === 'appendFile') {
      if (filesMap[commandParams.at]) {
        filesMap[commandParams.at].push({
          'appendFile': {
            from: commandParams.from,
            content: commandParams.content,
            context: commandParams.context
          }
        });
      } else {
        // same with create if not exist yet
        filesMap[commandParams.at] = [{
          'createFile': {
            from: commandParams.from,
            content: commandParams.content,
            context: commandParams.context
          }
        }];
      }
    } else if (commandName === 'deleteFile') {
      filesMap[commandParams.at] = [{
        'deleteFile': {}
      }];
    } else if (commandName === 'updateJSONFile') {
      if (!filesMap[commandParams.at]) {
        filesMap[commandParams.at] = [];
      }
      filesMap[commandParams.at].push({
        'updateJSONFile': {
          updator: commandParams.updator
        }
      });
    } else if (commandName === 'installDependency') {
      dependenciesMap[commandParams.package] = {
        command: 'install',
        version: commandParams.version,
        dev: commandParams.dev,
        mock: commandParams.mock
      };
    } else if (commandName === 'removeDependency') {
      dependenciesMap[commandParams.package] = {
        command: 'remove'
      };
    } else if (commandName === 'runShellCommand') {
      shellCommandsList.push(commandParams.command);
    }
  });
  commands.filter((c) => Object.keys(c)[0] === 'ensureDirectory').forEach((c) => {
    const commandParams = c[Object.keys(c)[0]];
    const destPath = path.join(destDir, commandParams.at);
    if (fs.existsSync(destPath) && fs.lstatSync(destPath).isDirectory() && fs.existsSync(path.join(destPath, '.keep'))) {
      // Dir exist already
      let needRemoveKeepFile = false;
      Object.keys(filesMap).forEach((filename) => {
        if (filesMap[filename][0]['createFile']) {
          if (filename.indexOf(commandParams.at) === 0) {
            needRemoveKeepFile = true;
          }
        }
      });
      if (!needRemoveKeepFile) {
        const currentFileNames = fs.readdirSync(destPath).map((fn) => path.join(destPath, fn));
        // .keep file itself, remove it from the list
        if (currentFileNames.includes(path.join(destPath, '.keep'))) {
          currentFileNames.splice(currentFileNames.indexOf(path.join(destPath, '.keep')), 1);
        }
        Object.keys(filesMap).forEach((filename) => {
          if (filesMap[filename][0]['deleteFile']) {
            if (currentFileNames.includes(filename)) {
              currentFileNames.splice(currentFileNames.indexOf(filename), 1);
            }
          }
        });
        if (currentFileNames.length > 0) {
          needRemoveKeepFile = true;
        }
      }
      if (needRemoveKeepFile) {
        filesMap[path.join(commandParams.at, '.keep')] = [{
          'deleteFile': {}
        }];
      }
    } else {
      // Dir not exist yet
      let needCreate = true;
      Object.keys(filesMap).forEach((filename) => {
        if (filesMap[filename][0]['createFile']) {
          if (filename.indexOf(commandParams.at) === 0) {
            needCreate = false;
          }
        }
      });
      if (needCreate) {
        filesMap[path.join(commandParams.at, '.keep')] = [{
          'createFile': {
            content: '',
            context: {}
          }
        }];
      }
    }
  });
  return {
    files: filesMap,
    dependencies: dependenciesMap,
    shellCommands: shellCommandsList
  };
};

module.exports = executeAllInstructions;
