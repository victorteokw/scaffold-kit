const { createCommand, executeCommand } = require('./command');

const {
  pushInstruction,
  pushInstructions,
  editInstructions,
  executeAllInstructions
} = require('./executor');

const { createApp, startApp } = require('./app');

module.exports = {
  // Command
  createCommand, executeCommand,
  // Execution
  pushInstruction, pushInstructions, editInstructions, executeAllInstructions,
  // App
  createApp, startApp
};
