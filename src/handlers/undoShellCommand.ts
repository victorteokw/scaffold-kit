import UndoShellCommandInfo from '../instructions/UndoShellCommandInfo';
import Reporter from '../Reporter';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const undoShellCommand = async (
  params: UndoShellCommandInfo,
  reporter: Reporter
) => {
  const { reverseCommand } = params;
  reporter.push({ message: 'run', command: reverseCommand });
  const obj = await execAsync(reverseCommand);
  if (obj.stderr) {
    process.stdout.write(obj.stdout);
    process.stderr.write(obj.stderr);
    reporter.push({ message: 'failed', command: reverseCommand });
  } else {
    process.stdout.write(obj.stdout);
  }
};

export default undoShellCommand;
