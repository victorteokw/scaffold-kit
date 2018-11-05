const commandLineArgs = require('command-line-args');
const kebabCase = require('lodash/kebabCase');
const assign = require('lodash/assign');
const map = require('lodash/map');
const pick = require('lodash/pick');

const basicOptions = [
  { name: 'version', alias: 'v', type: Boolean, defaultValue: false },
  { name: 'help', alias: 'h', type: Boolean, defaultValue: false }
];

const convertOptions = (options) => {
  const picked = pick(options, [
    'name',
    'type',
    'alias',
    'multiple',
    'lazyMultiple',
    'defaultOption',
    'defaultValue',
    'group'
  ]);
  return map(picked, (o) => {
    o.name = kebabCase(o.name);
    return o;
  });
};

const parsingCommandLineArgs = (argv = process.argv, app) => {
  const parsed = commandLineArgs(assign(
    {}, basicOptions, convertOptions(app.options)
  ), {
    camelCase: true,
    partial: true,
    argv
  });

  const { _unknown: [ command, ...args ], ...options } = parsed;
  return { command, args, options };
};

module.exports = parsingCommandLineArgs;
