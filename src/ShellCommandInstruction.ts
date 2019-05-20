interface ShellCommandInstruction {
  type: 'runShellCommand' | 'undoShellCommand',
  detail: {
    command: string,
    undoCommand: string
  }
}

export default ShellCommandInstruction;
