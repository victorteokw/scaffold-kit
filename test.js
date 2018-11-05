const commandLineArgs = require('command-line-args');
const options = commandLineArgs([
  { name: 'version', alias: 'v', type: Boolean, defaultValue: false },
  { name: 'skip-install', type: Boolean, defaultValue: false },
  { name: 'help', alias: 'h', type: Boolean, defaultValue: false }
], { camelCase: true, partial: true });

console.log(options);
