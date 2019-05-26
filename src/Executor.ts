import Instruction from "./Instruction";
import Handler from './Handler';
import * as handlers from './handlers';
import DependencyInstruction from './DependencyInstruction';
import FileInstruction from './FileInstruction';
import ShellCommandInstruction from './ShellCommandInstruction';
import Reporter from "./Reporter";

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

class Executor {

  public instructions: Instruction[] = [];
  protected done: boolean = false;
  private handlers: { [key: string]: any } = handlers;

  constructor() {
    /**/
  }

  public push(instruction: Instruction): Executor {
    this.instructions.push(instruction);
    return this;
  }

  public async flush(reporter: Reporter) {
    const files: FileInstructionMap = {};
    const directories: FileInstructionMap = {};
    const dependencies: DependencyInstructionMap = {};
    const commands: ShellCommandInstruction[] = [];
    const { length } = this.instructions;
    for(let i = 0; i < length; i++) {
      const instruction = this.instructions[i];
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
        await this.handlers[inst.type](inst.detail, reporter);
      }
    }
    const dirNames = Object.keys(directories).sort();
    for (const dirName of dirNames) {
      for (const inst of directories[dirName]) {
        await this.handlers[inst.type](inst.detail, reporter);
      }
    }
    const dependencyNames = Object.keys(dependencies).sort();
    for (const dependencyName of dependencyNames) {
      const inst = dependencies[dependencyName];
      await this.handlers[inst.type](inst.detail, reporter);
    }
    for (const inst of commands) {
      await this.handlers[inst.type](inst.detail, reporter);
    }
    this.done = true;
  };
}

export default Executor;
