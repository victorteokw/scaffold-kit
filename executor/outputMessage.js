const chalk = require('chalk');

const outputMessage = (flag, flagColor, text) => {
  console.log(`${chalk[flagColor](flag.padStart(12))} ${text}`);
};

module.exports = outputMessage;
