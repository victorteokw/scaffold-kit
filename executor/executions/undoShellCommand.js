const util = require('util');
const exec = util.promisify(require('child_process').exec);
const outputMessage = require('./outputMessage');

const undoShellCommand = async ({ revertCommand, silent }) => {
  outputMessage('run', 'green', revertCommand, silent);
  const obj = await exec(revertCommand);
  if (silent) return;
  if (obj.err) {
    process.stdout.write(obj.stdout);
    process.stderr.write(obj.stderr);
    outputMessage('failed', 'red', revertCommand, silent);
  } else {
    process.stdout.write(obj.stdout);
  }
};

module.exports = undoShellCommand;
