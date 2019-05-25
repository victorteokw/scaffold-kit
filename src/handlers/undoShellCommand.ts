const util = require('util');
const exec = util.promisify(require('child_process').exec);
const outputMessage = require('./outputMessage');

const undoShellCommand = async ({ reverseCommand, silent }) => {
  outputMessage('run', 'green', reverseCommand, silent);
  const obj = await exec(reverseCommand);
  if (silent) return;
  if (obj.err) {
    process.stdout.write(obj.stdout);
    process.stderr.write(obj.stderr);
    outputMessage('failed', 'red', reverseCommand, silent);
  } else {
    process.stdout.write(obj.stdout);
  }
};

export default undoShellCommand;
