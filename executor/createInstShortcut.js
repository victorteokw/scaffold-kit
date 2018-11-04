const pushInstruction = require('./pushInstruction');

const createInstShortcut = (shortcut) => {
  return (params) => {
    return pushInstruction({
      [shortcut]: params
    });
  };
};

module.exports = createInstShortcut;
