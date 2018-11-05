const commandLineArgs = require('command-line-args');

module.exports = (app, argv = process.argv) => {
  const parsed = commandLineArgs([
    { name: 'version', alias: 'v', type: Boolean, defaultValue: false },
    { name: 'help', alias: 'h', type: Boolean, defaultValue: false }
  ], {
    camelCase: true,
    partial: true,
    argv
  });

  const { _unknown: [ command, ...args ], ...options } = parsed;
  return { command, args, options };
};
