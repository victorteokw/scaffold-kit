import Context from './Context';
import DependencyInstruction from './DependencyInstruction';
import FileInstruction from './FileInstruction';
import ShellCommandInstruction from './ShellCommandInstruction';

interface FileInstructionMap { [key: string]: FileInstruction[] }
interface DependencyInstructionMap { [key: string]: DependencyInstruction }

function isFileCommand(command: string) {
  return [
    'createFile', 'deleteFile', 'appendFile', 'detachFromFile',
    'updateFile', 'rollbackFile', 'updateJSONFile', 'rollbackJSONFile',
    'installDependency', 'removeDependency',
    'runShellCommand', 'undoShellCommand',
    'keepDirectoryInGit'
  ].includes(command);
}

function isDirectoryCommand(command: string) {
  return ['keepDirectoryInGit'].includes(command);
}

function isDependencyCommand(command: string) {
  return ['installDependency', 'removeDependency'].includes(command);
}

function isShellCommand(command: string) {
  return ['runShellCommand', 'undoShellCommand'].includes(command);
}

async function flushContext(context: Context) {
  const { instructions } = context;
  const files: FileInstructionMap = {};
  const directories: FileInstructionMap = {};
  const dependencies: DependencyInstructionMap = {};
  const commands: ShellCommandInstruction[] = [];
  const { length } = instructions;
  for(let i = 0; i < length; i++) {
    const instruction = instructions[i];
    if (isFileCommand(instruction.type)) {
      const ins = instruction as FileInstruction;
      if (!files[ins.detail.at]) files[ins.detail.at] = [];
      files[ins.detail.at].push(ins);
    } else if (isDirectoryCommand(instruction.type)) {
      const ins = instruction as FileInstruction;
      if (!directories[ins.detail.at]) directories[ins.detail.at] = [];
      directories[ins.detail.at].push(ins);
    } else if (isDependencyCommand(instruction.type)) {
      const ins = instruction as DependencyInstruction;
      dependencies[ins.detail.package] = ins;
    } else if (isShellCommand(instruction.type)) {
      const ins = instruction as ShellCommandInstruction;
      commands.push(ins);
    } else {
      throw new Error(`unknown instruction type \`${instruction.type}'.`)
    }
  }
  const fileNames = Object.keys(files).sort();
  for (const fileName of fileNames) {
    for (const inst of files[fileName]) {
      await executions[inst.type](inst.detail);
    }
  }
  const dirNames = Object.keys(directories).sort();
  for (const dirName of dirNames) {
    for (const inst of directories[dirName]) {
      await executions[inst.type](inst.detail);
    }
  }
  const dependencyNames = Object.keys(dependencies).sort();
  for (const dependencyName of dependencyNames) {
    const inst = dependencies[dependencyName];
    await executions[inst.type](inst.detail);
  }
  for (const inst of commands) {
    await executions[inst.type](inst.detail);
  }
};

export default flushContext;
