interface DependencyInstruction {
  type: string,
  detail: {
    package: string
  }
}

export default DependencyInstruction;
