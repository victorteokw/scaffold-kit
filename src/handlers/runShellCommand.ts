const util = require('util');
const exec = util.promisify(require('child_process').exec);
const outputMessage = require('./outputMessage');

export default  async function runShellCommand ({ command, silent }) {
  outputMessage('run', 'green', command, silent);
  const obj = await exec(command);
  if (silent) return;
  if (obj.err) {
    process.stdout.write(obj.stdout);
    process.stderr.write(obj.stderr);
    outputMessage('failed', 'red', command, silent);
  } else {
    process.stdout.write(obj.stdout);
  }
};
