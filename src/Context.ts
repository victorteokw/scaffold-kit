import * as path from 'path';
import ExecutionInfo from './ExecutionInfo';
import AppendFileInfo from './instructions/AppendFileInfo';
import CreateFileInfo from './instructions/CreateFileInfo';
import DeleteFileInfo from './instructions/DeleteFileInfo';
import DetachFromFileInfo from './instructions/DetachFromFileInfo';
import RollbackFileInfo from './instructions/RollbackFileInfo';
import RollbackJSONFileInfo from './instructions/RollbackJSONFileInfo';
import UpdateFileInfo from './instructions/UpdateFileInfo';
import UpdateJSONFileInfo from './instructions/UpdateJSONFileInfo';
import InstallDependencyInfo from './instructions/InstallDependencyInfo';
import RemoveDependencyInfo from './instructions/RemoveDependencyInfo';
import RunShellCommandInfo from './instructions/RunShellCommandInfo';
import UndoShellCommandInfo from './instructions/UndoShellCommandInfo';
import KeepDirectoryInGitInfo from './instructions/KeepDirectoryInGitInfo';
import OptionRules from './OptionRules';
import Options from './Options';
import Reporter from './Reporter';
import plainReporter from './reporters/plainReporter';
import firstDefined from './utilities/firstDefined';
import Executor from './Executor';
import HelpSection from './HelpSection';

class Context implements ExecutionInfo {

  // middleware extentions

  public optionDefinitions: OptionRules = {};
  public savedOptions: Options = {};

  // user execution information

  public wd: string;
  public args: string[];
  public options: Options;

  // context options

  public overwrite: boolean = false;
  public mockInstall: boolean = false;

  // help behavior
  public helpMode: boolean = false;
  public helpSections: HelpSection[] = [];

  // execution behavior

  public disableFlush: boolean = false;
  public reporter: Reporter = plainReporter;
  public readonly executor: Executor = new Executor();

  private templateLocation?: string;

  // initialize method

  constructor(executionInfo: ExecutionInfo) {
    this.wd = executionInfo.wd;
    this.args = executionInfo.args;
    this.options = executionInfo.options;
  }

  // instruction methods

  public createFile(detail: CreateFileInfo) {
    this.executor.push({
      detail: {
        at: this.applyDestination(detail.at),
        content: detail.content,
        context: detail.context,
        from: detail.from ? this.applyTemplate(detail.from) : detail.from,
        overwrite: firstDefined(detail.overwrite, this.overwrite)
      },
      type: 'createFile'
    });
  }

  public createFiles(details: CreateFileInfo[]) {
    for (const detail of details) {
      this.createFile(detail);
    }
  }

  public deleteFile(detail: DeleteFileInfo) {
    this.executor.push({
      detail: {
        at: this.applyDestination(detail.at),
        content: detail.content,
        context: detail.context,
        from: detail.from ? this.applyTemplate(detail.from) : detail.from,
        overwrite: firstDefined(detail.overwrite, this.overwrite)
      },
      type: 'deleteFile'
    });
  }

  public deleteFiles(details: DeleteFileInfo[]) {
    for (const detail of details) {
      this.deleteFile(detail);
    }
  }

  public appendFile(detail: AppendFileInfo) {
    this.executor.push({
      detail: {
        at: this.applyDestination(detail.at),
        content: detail.content,
        context: detail.context,
        from: detail.from ? this.applyTemplate(detail.from) : detail.from,
      },
      type: 'appendFile'
    });
  }

  public appendFiles(details: AppendFileInfo[]) {
    for (const detail of details) {
      this.appendFile(detail);
    }
  }

  public detachFromFile(detail: DetachFromFileInfo) {
    this.executor.push({
      detail: {
        at: this.applyDestination(detail.at),
        content: detail.content,
        context: detail.context,
        from: detail.from ? this.applyTemplate(detail.from) : detail.from,
      },
      type: 'detachFromFile'
    });
  }

  public detachFromFiles(details: DetachFromFileInfo[]) {
    for (const detail of details) {
      this.detachFromFile(detail);
    }
  }

  public updateFile(detail: UpdateFileInfo) {
    this.executor.push({
      detail: {
        at: this.applyDestination(detail.at),
        updator: detail.updator,
        rollbacker: detail.rollbacker
      },
      type: 'updateFile'
    });
  }

  public updateFiles(details: UpdateFileInfo[]) {
    for (const detail of details) {
      this.updateFile(detail);
    }
  }

  public rollbackFile(detail: RollbackFileInfo) {
    this.executor.push({
      detail: {
        at: this.applyDestination(detail.at),
        updator: detail.updator,
        rollbacker: detail.rollbacker
      },
      type: 'rollbackFile'
    });
  }

  public rollbackFiles(details: RollbackFileInfo[]) {
    for (const detail of details) {
      this.rollbackFile(detail);
    }
  }

  public updateJSONFile(detail: UpdateJSONFileInfo) {
    this.executor.push({
      detail: {
        at: this.applyDestination(detail.at),
        updator: detail.updator,
        rollbacker: detail.rollbacker
      },
      type: 'updateJSONFile'
    });
  }

  public updateJSONFiles(details: UpdateJSONFileInfo[]) {
    for (const detail of details) {
      this.updateJSONFile(detail);
    }
  }

  public rollbackJSONFile(detail: RollbackJSONFileInfo) {
    this.executor.push({
      detail: {
        at: this.applyDestination(detail.at),
        updator: detail.updator,
        rollbacker: detail.rollbacker
      },
      type: 'rollbackJSONFile'
    });
  }

  public rollbackJSONFiles(details: RollbackJSONFileInfo[]) {
    for (const detail of details) {
      this.rollbackFile(detail);
    }
  }

  public installDependency(detail: InstallDependencyInfo) {
    this.executor.push({
      detail: {
        package: detail.package,
        version: detail.version,
        dev: detail.dev,
        mock: firstDefined(detail.mock, this.mockInstall),
        wd: detail.wd || this.wd
      },
      type: 'installDependency'
    });
  }

  public installDependencies(details: InstallDependencyInfo[]) {
    for (const detail of details) {
      this.installDependency(detail);
    }
  }

  public removeDependency(detail: RemoveDependencyInfo) {
    this.executor.push({
      detail: {
        package: detail.package,
        version: detail.version,
        dev: detail.dev,
        mock: firstDefined(detail.mock, this.mockInstall),
        wd: detail.wd || this.wd
      },
      type: 'removeDependency'
    });
  }

  public removeDependencies(details: RemoveDependencyInfo[]) {
    for (const detail of details) {
      this.removeDependency(detail);
    }
  }

  public runShellCommand(detail: RunShellCommandInfo) {
    this.executor.push({
      detail: {
        command: detail.command,
        reverseCommand: detail.reverseCommand
      },
      type: 'runShellCommand'
    });
  }

  public runShellCommands(details: RunShellCommandInfo[]) {
    for (const detail of details) {
      this.runShellCommand(detail);
    }
  }

  public undoShellCommand(detail: UndoShellCommandInfo) {
    this.executor.push({
      detail: {
        command: detail.command,
        reverseCommand: detail.reverseCommand
      },
      type: 'undoShellCommand'
    });
  }

  public undoShellCommands(details: UndoShellCommandInfo[]) {
    for (const detail of details) {
      this.undoShellCommand(detail);
    }
  }

  public keepDirectoryInGit(detail: KeepDirectoryInGitInfo) {
    this.executor.push({
      detail: {
        at: this.applyDestination(detail.at)
      },
      type: 'keepDirectoryInGit'
    });
  }

  public keepDirectoryInGits(details: KeepDirectoryInGitInfo[]) {
    for (const detail of details) {
      this.keepDirectoryInGit(detail);
    }
  }

  // instruction helpers

  public async useTemplateFrom(
    templateLocation: string,
    callback: () => Promise<void> | void
  ) {
    this.templateLocation = templateLocation;
    await callback();
    this.templateLocation = undefined;
  }

  private applyTemplate(relTempPath: string) {
    if (!relTempPath) return undefined;
    if (!this.templateLocation) return relTempPath;
    return path.resolve(this.templateLocation, relTempPath);
  }

  private applyDestination(relDestPath: string) {
    return path.resolve(this.wd, relDestPath);
  }

}

export default Context;
