const includes = require('lodash/includes');
const map = require('lodash/map');
const each = require('lodash/each');
const { singular } = require('pluralize');

const error = require('../error');
const instRegistry = require('./instRegistry');

const knownInstructions = [
  'createFile',
  'deleteFile',
  'appendFile',
  'detachFromFile',
  'updateFile',
  'rollbackFile',
  'updateJSONFile',
  'rollbackJSONFile',
  'installDependency',
  'removeDependency',
  'runShellCommand',
  'keepDirectoryInGit'
];

const toSingularInstName = (name) => {
  const specialCommandNames = { 'keepDirectoriesInGit': 'keepDirectoryInGit' };
  return specialCommandNames[name] || singular(name);
};

const isSingleCommand = (command) => {
  return includes(knownInstructions, Object.keys(command)[0]);
};

const isArrayCommand = (command) => {
  return includes(
    knownInstructions,
    toSingularInstName(Object.keys(command)[0])
  );
};

const separateArrayCommand = (command) => {
  const pluralName = Object.keys(command)[0];
  return map(command[pluralName], (c) => ({ [singular(pluralName)]: c }));
};

const throwCommand = (command) => {
  throw error(`Invalid command: ${JSON.stringify(command, null, 2)}`);
};

// Only check if command is exist yet.
const validateCommand = (command) => {
  if (Object.keys(command).length !== 1) {
    throwCommand(command);
  }
  if (!isSingleCommand(command)) {
    if (!isArrayCommand(command)) {
      throw `Invalid command: ${JSON.stringify(command, null, 2)}`;
    }
  }
};

const pushInstruction = (command) => {
  validateCommand(command);
  if (isSingleCommand(command)) {
    const name = Object.keys(command)[0];
    const params = command[name];
    instRegistry.push(name, params);
  } else if (isArrayCommand(command)) {
    each(separateArrayCommand(command), (c) => {
      const name = Object.keys(c)[0];
      const params = c[name];
      instRegistry.push(name, params);
    });
  }
};

module.exports = pushInstruction;
