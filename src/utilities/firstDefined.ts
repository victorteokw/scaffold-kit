function firstDefined<T> (...args: T[]): T | undefined {
  for (const arg of args) {
    if (arg !== undefined) {
      return arg;
    }
  }
  return undefined;
};
export default firstDefined;
