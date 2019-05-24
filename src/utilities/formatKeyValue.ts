function formatKeyValue (key: string, value: any): string {
  return `"${key}": ${JSON.stringify(value)}`;
};
export default formatKeyValue;
