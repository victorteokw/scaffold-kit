const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const ejs = require('ejs');

const executeFileCommandsAndOutputMessage = (target, commands, destDir) => {

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
