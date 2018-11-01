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
  'updateJSONFile',
  'ensureDirectory',
  'installDependency',
  'removeDependency',
  'runShellCommand'
];

const isSingleCommand = (command) => {
  return includes(knownInstructions, Object.keys(command)[0]);
};

const isArrayCommand = (command) => {
  return includes(knownInstructions, singular(Object.keys(command)[0]));
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

// TODO: Should have documentation here ...
// const instructions = {
//   createFile: {
//     fields: {
//       from: '[optional string] the src location, should be present if content is not present.',
//       content: '[optional string] the file content, should be present if src is not present.',
//       at: '[required string] the relative destination location.',
//       context: '[optional object] the rendering template context.'
//     }
//   },
//   appendFile: {
//     fields: {
//       from: '[optional string] the src location, should be present if content is not present.',
//       content: '[optional string] the file content, should be present if src is not present.',
//       at: '[required string] the relative destination location.',
//       context: '[optional object] the rendering template context.'
//     }
//   },
//   deleteFile: {
//     fields: {
//       at: '[required string] which file to delete'
//     }
//   },
//   updateJSONFile: {
//     fields: {
//       at: '[required string] which file to update',
//       updator: '[required (object) => object] the json updator'
//     }
//   },
//   ensureDirectory: {
//     fields: {
//       at: '[required string] the directory name.'
//     }
//   },
//   installDependency: {
//     fields: {
//       package: '[required string] package name',
//       version: '[required string] version',
//       dev: '[required boolean] is dev dependency',
//       mock: '[required boolean] is fake installing (for unit test)'
//     }
//   },
//   removeDependency: {
//     fields: {
//       package: '[required string] the package name'
//     }
//   },
//   runShellCommand: {
//     fields: {
//       command: '[required string] the command to run'
//     }
//   }
// };
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
