import Reporter from '../Reporter';
import RunShellCommandInfo from '../instructions/RunShellCommandInfo';

import { promisify } from 'util';
import { exec } from 'child_process';
const execAsync = promisify(exec);

const runShellCommand = async (
  params: RunShellCommandInfo,
  reporter: Reporter
) => {
  const { command } = params;
  reporter.push({ message: 'run', command });
  const obj = await execAsync(command);

  if (obj.stderr) {
    process.stdout.write(obj.stdout);
    process.stderr.write(obj.stderr);
    reporter.push({ message: 'failed', command });
  } else {
    process.stdout.write(obj.stdout);
  }
};

export default runShellCommand;
