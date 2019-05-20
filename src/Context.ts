import * as path from 'path';
import ExecutionInfo from './ExecutionInfo';
import Instruction from './Instruction';
import CreateFileInfo from './instructions/CreateFileInfo';
import DeleteFileInfo from './instructions/DeleteFileInfo';
import AppendFileInfo from './instructions/AppendFileInfo';
import DetachFromFileInfo from './instructions/DetachFromFileInfo';
import firstDefined from './utilities/firstDefined';

class Context implements ExecutionInfo {

  // user execution information

  public wd: string;
  public args: string[];
  public options: object;

  // context options

  public overwrite: boolean = false;
  public silent: boolean = false;
  public mockInstall: boolean = false;

  // instructions

  public instructions: Instruction[];
  private templateLocation?: string;

  // initialize method

  constructor(executionInfo: ExecutionInfo) {
    this.wd = executionInfo.wd;
    this.args = executionInfo.args;
    this.options = executionInfo.options;
    this.instructions = [];
  }

  // instruction methods

  public async useTemplateFrom(
    templateLocation: string,
    callback: () => Promise<void>
  ) {
    this.templateLocation = templateLocation;
    await callback();
    this.templateLocation = undefined;
  }

  public createFile(detail: CreateFileInfo) {
    this.instructions.push({
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
    this.instructions.push({
      detail: {
        at: this.applyDestination(detail.at)
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
    this.instructions.push({
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
    this.instructions.push({
      detail: {
        at: this.applyDestination(detail.at),
        content: detail.content,
        context: detail.context,
        from: detail.from ? this.applyTemplate(detail.from) : detail.from,
      },
      type: 'detachFromFile'
    })
  }

  public detachFromFiles(details: DetachFromFileInfo[]) {
    for (const detail of details) {
      this.detachFromFile(detail);
    }
  }
  // instruction helpers

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
