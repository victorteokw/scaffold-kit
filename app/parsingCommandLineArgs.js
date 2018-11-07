const commandLineArgs = require('command-line-args');
const kebabCase = require('lodash/kebabCase');
const concat = require('lodash/concat');
const map = require('lodash/map');
const pick = require('lodash/pick');
const assign = require('lodash/assign');

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

const parsingCommandLineArgs = (argv = process.argv, optionList) => {
  const parsed = commandLineArgs(
    concat(basicOptions, convertOptions(optionList)),
    {
      camelCase: true,
      partial: true,
      argv
    }
  );
  const { _unknown: [ command, ...args ], ...options } =
    assign({ _unknown: [] }, parsed);
  return { command, args, options };
};

module.exports = parsingCommandLineArgs;
