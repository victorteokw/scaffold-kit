const { createCommand, executeCommand } = require('./command');

const { pushInstruction, pushInstructions, executeAllInstructions } = require('./executor');

const { createApp, startApp } = require('./app');

module.exports = {
  // Command
  createCommand, executeCommand,
  // Execution
  pushInstruction, pushInstructions, executeAllInstructions,
  // App
  createApp, startApp
};
