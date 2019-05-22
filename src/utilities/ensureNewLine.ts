function ensureNewLine(value: string): string {
  return value.endsWith('\n') ? value : value + '\n';
};
export default ensureNewLine;
