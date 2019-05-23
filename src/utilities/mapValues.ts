function mapValues(collection: object, transformer: (any) => any) {
  const keys = Object.keys(collection);
  const retval = {};
  for (const key of keys) {
    retval[key] = transformer(collection[key]);
  }
  return retval;
}

export default mapValues;
