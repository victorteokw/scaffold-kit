const chalk = require('chalk');

const outputMessage = (flag, flagColor, text, silent) => {
  if (silent) return;
  console.log(`${chalk[flagColor](flag.padStart(12))} ${text}`);
};

module.exports = outputMessage;
