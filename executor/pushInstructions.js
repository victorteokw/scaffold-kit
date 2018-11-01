const pushInstruction = require('./pushInstruction');

const pushInstructions = (commands) => {
  commands.map((command) => pushInstruction(command));
};

module.exports = pushInstructions;
