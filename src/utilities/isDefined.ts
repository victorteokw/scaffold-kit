function isDefined<T> (arg: T | undefined): boolean {
  return undefined !== arg;
};
export default isDefined;
