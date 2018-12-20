// Core functions

const useTemplatesFrom = require('./useTemplatesFrom');
const pushInstruction = require('./pushInstruction');
const pushInstructions = require('./pushInstructions');
const getInstructions = require('./getInstructions');
const replaceInstructions = require('./replaceInstructions');
const revertInstruction = require('./revertInstruction');
const { setExecutorOption } = require('./executorOptions');
const createInstShortcut = require('./createInstShortcut');
const resetExecutor = require('./resetExecutor');

// Utility functions

const iterateTemplateFilesFromDirectory =
  require('./iterateTemplateFilesFromDirectory');

// Instruction shortcuts

const createFile = createInstShortcut('createFile');
const deleteFile = createInstShortcut('deleteFile');
const appendFile = createInstShortcut('appendFile');
const detachFromFile = createInstShortcut('detachFromFile');
const updateFile = createInstShortcut('updateFile');
const rollbackFile = createInstShortcut('rollbackFile');
const updateJSONFile = createInstShortcut('updateJSONFile');
const rollbackJSONFile = createInstShortcut('rollbackJSONFile');
const installDependency = createInstShortcut('installDependency');
const removeDependency = createInstShortcut('removeDependency');
const runShellCommand = createInstShortcut('runShellCommand');
const undoShellCommand = createInstShortcut('undoShellCommand');
const keepDirectoryInGit = createInstShortcut('keepDirectoryInGit');

const createFiles = createInstShortcut('createFiles');
const deleteFiles = createInstShortcut('deleteFiles');
const appendFiles = createInstShortcut('appendFiles');
const detachFromFiles = createInstShortcut('detachFromFiles');
const updateFiles = createInstShortcut('updateFiles');
const rollbackFiles = createInstShortcut('rollbackFiles');
const updateJSONFiles = createInstShortcut('updateJSONFiles');
const rollbackJSONFiles = createInstShortcut('rollbackJSONFiles');
const installDependencies = createInstShortcut('installDependencies');
const removeDependencies = createInstShortcut('removeDependencies');
const runShellCommands = createInstShortcut('runShellCommands');
const undoShellCommands = createInstShortcut('undoShellCommands');
const keepDirectoriesInGit = createInstShortcut('keepDirectoriesInGit');

module.exports = {

  // Core functions

  useTemplatesFrom,
  pushInstruction,
  pushInstructions,
  getInstructions,
  replaceInstructions,
  revertInstruction,
  setExecutorOption,
  resetExecutor,

  // Utility functions

  iterateTemplateFilesFromDirectory,

  // Instruction shortcuts

  createFile,
  deleteFile,
  appendFile,
  detachFromFile,
  updateFile,
  rollbackFile,
  updateJSONFile,
  rollbackJSONFile,
  installDependency,
  removeDependency,
  runShellCommand,
  undoShellCommand,
  keepDirectoryInGit,

  createFiles,
  deleteFiles,
  appendFiles,
  detachFromFiles,
  updateFiles,
  rollbackFiles,
  updateJSONFiles,
  rollbackJSONFiles,
  installDependencies,
  removeDependencies,
  runShellCommands,
  undoShellCommands,
  keepDirectoriesInGit
};
