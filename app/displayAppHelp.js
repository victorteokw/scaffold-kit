const each = require('lodash/map');
const kebabCase = require('lodash/kebabCase');
const displayBehavioralHelp = require('./displayBehavioralHelp');

const displayAppHelp = (app) => {
  const defaultDesc = 'Description not provided.';
  console.log('');
  console.log(`${app.appName} ${app.version}`);
  console.log('');
  console.log(`${app.description}`);
  console.log('');
  console.log('Commands:');
  console.log('');
  each(app.commands, (c, n) => {
    const command = require(c);
    console.log(`  ${n.padEnd(14)}${command.description || defaultDesc}`);
  });
  console.log('');
  console.log('App level options:');
  console.log('');
  each(app.options, ({ name, description }) => {
    console.log(`  --${kebabCase(name).padEnd(14)} ${description || defaultDesc}`);
  });
  console.log('');
  displayBehavioralHelp(app);
};

module.exports = displayAppHelp;
