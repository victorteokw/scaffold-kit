const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const ejs = require('ejs');
const assign = require('lodash/assign');
const each = require('lodash/each');
const sortBy = require('lodash/sortBy');
const keys = require('lodash/keys');
const instRegistry = require('./instRegistry');
const rawInstsToExecutable = require('./rawInstsToExecutable');
const { getExecutorOptions } = require('./executorOptions');
const outputMessage = require('./outputMessage');
const executions = require('./executions');

const executeAllInstructions = () => {
  const executable = rawInstsToExecutable(instRegistry.getAll());
  const { files, dependencies, commands, directories } = executable;
  each(sortBy(keys(files)), (insts) => {
    each(insts, ({ name, params }) => {
      executions[name](assign(getExecutorOptions(), params));
    });
  });
  each(sortBy(keys(directories)), ({ name, params }) => {
    executions[name](assign(getExecutorOptions(), params));
  });
  each(sortBy(keys(dependencies)), ({ name, params }) => {
    executions[name](assign(getExecutorOptions(), params));
  });
  each(commands, ({ name, params }) => {
    executions[name](assign(getExecutorOptions(), params));
  });
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

module.exports = executeAllInstructions;
