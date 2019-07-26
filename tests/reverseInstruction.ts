import reverseInstruction from '../src/reverseInstruction';
import Instruction from '../src/Instruction';

describe('reverse instruction', () => {
  it('reverse appendFile into detachFromFile', () => {
    const appendFileInst: Instruction = {
      type: 'appendFile',
      detail: {
        from: 'a.txt',
        context: { a: 1 },
        at: 'a.txt'
      }
    };
    const detachFromFileInst = reverseInstruction(appendFileInst);
    expect(detachFromFileInst).toEqual({
      type: 'detachFromFile',
      detail: {
        from: 'a.txt',
        context: { a: 1 },
        at: 'a.txt'
      }
    });
  });

  it('reverse detachFromFile into appendFile', () => {
    const detachFromFileInst: Instruction = {
      type: 'detachFromFile',
      detail: {
        from: 'a.txt',
        context: { a: 1 },
        at: 'a.txt'
      }
    };
    const appendFileInst = reverseInstruction(detachFromFileInst);
    expect(appendFileInst).toEqual({
      type: 'appendFile',
      detail: {
        from: 'a.txt',
        context: { a: 1 },
        at: 'a.txt'
      }
    });
  });

  it('reverse createFile into deleteFile', () => {
    const createFileInst: Instruction = {
      type: 'createFile',
      detail: {
        from: 'a.txt',
        context: { a: 1 },
        at: 'a.txt'
      }
    };
    const deleteFileInst = reverseInstruction(createFileInst);
    expect(deleteFileInst).toEqual({
      type: 'deleteFile',
      detail: {
        from: 'a.txt',
        context: { a: 1 },
        at: 'a.txt'
      }
    });
  });

  it('reverse deleteFile into createFile', () => {
    const deleteFileInst: Instruction = {
      type: 'deleteFile',
      detail: {
        from: 'a.txt',
        context: { a: 1 },
        at: 'a.txt'
      }
    };
    const createFileInst = reverseInstruction(deleteFileInst);
    expect(createFileInst).toEqual({
      type: 'createFile',
      detail: {
        from: 'a.txt',
        context: { a: 1 },
        at: 'a.txt'
      }
    });
  });

  it('reverse installDependecy into removeDependency', () => {
    const installDependencyInst: Instruction = {
      type: 'installDependency',
      detail: {
        package: 'nextjs',
        version: '^25.0.0',
        dev: false
      }
    };
    const removeDependencyInst = reverseInstruction(installDependencyInst);
    expect(removeDependencyInst).toEqual({
      type: 'removeDependency',
      detail: {
        package: 'nextjs',
        version: '^25.0.0',
        dev: false
      }
    });
  });

  it('reverse removeDependecy into installDependency', () => {
    const removeDependencyInst: Instruction = {
      type: 'removeDependency',
      detail: {
        package: 'nextjs',
        version: '^25.0.0',
        dev: false
      }
    };
    const installDependencyInst = reverseInstruction(removeDependencyInst);
    expect(installDependencyInst).toEqual({
      type: 'installDependency',
      detail: {
        package: 'nextjs',
        version: '^25.0.0',
        dev: false
      }
    });
  });

  it('reverse runShellCommand into undoShellCommand', () => {
    const runShellCommand: Instruction = {
      type: 'runShellCommand',
      detail: {
        command: 'git init',
        reverseCommand: 'rm -rf ./git'
      }
    };
    const undoShellCommand = reverseInstruction(runShellCommand);
    expect(undoShellCommand).toEqual({
      type: 'undoShellCommand',
      detail: {
        command: 'git init',
        reverseCommand: 'rm -rf ./git'
      }
    });
  });

  it('reverse undoShellCommand into runShellCommand', () => {
    const undoShellCommand: Instruction = {
      type: 'undoShellCommand',
      detail: {
        command: 'git init',
        reverseCommand: 'rm -rf ./git'
      }
    };
    const runShellCommand = reverseInstruction(undoShellCommand);
    expect(runShellCommand).toEqual({
      type: 'runShellCommand',
      detail: {
        command: 'git init',
        reverseCommand: 'rm -rf ./git'
      }
    });
  });

  it('reverse updateFile into rollbackFile', () => {
    const updator = () => {/* */};
    const rollbacker = () => {/* */};
    const updateFile: Instruction = {
      type: 'updateFile',
      detail: {
        updator, rollbacker
      }
    };
    const rollbackFile = reverseInstruction(updateFile);
    expect(rollbackFile).toEqual({
      type: 'rollbackFile',
      detail: {
        updator, rollbacker
      }
    });
  });

  it('reverse rollbackFile into updateFile', () => {
    const updator = () => {/* */};
    const rollbacker = () => {/* */};
    const rollbackFile: Instruction = {
      type: 'rollbackFile',
      detail: {
        updator, rollbacker
      }
    };
    const updateFile = reverseInstruction(rollbackFile);
    expect(updateFile).toEqual({
      type: 'updateFile',
      detail: {
        updator, rollbacker
      }
    });
  });

  it('reverse updateJSONFile into rollbackJSONFile', () => {
    const updator = () => {/* */};
    const rollbacker = () => {/* */};
    const updateJSONFile: Instruction = {
      type: 'updateJSONFile',
      detail: {
        updator, rollbacker
      }
    };
    const rollbackJSONFile = reverseInstruction(updateJSONFile);
    expect(rollbackJSONFile).toEqual({
      type: 'rollbackJSONFile',
      detail: {
        updator, rollbacker
      }
    });
  });

  it('reverse rollbackJSONFile into updateJSONFile', () => {
    const updator = () => {/* */};
    const rollbacker = () => {/* */};
    const rollbackJSONFile: Instruction = {
      type: 'rollbackJSONFile',
      detail: {
        updator, rollbacker
      }
    };
    const updateJSONFile = reverseInstruction(rollbackJSONFile);
    expect(updateJSONFile).toEqual({
      type: 'updateJSONFile',
      detail: {
        updator, rollbacker
      }
    });
  });

});
