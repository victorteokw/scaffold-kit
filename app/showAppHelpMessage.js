const map = require('lodash/map');
const kebabCase = require('lodash/kebabCase');
const showConfigurableHelpMessages = require('./showConfigurableHelpMessages');

module.exports = (app) => {
  const defaultDesc = 'Description not provided.';
  console.log('');
  console.log(`${app.appName} ${app.version}`);
  console.log('');
  console.log(`${app.description}`);
  console.log('');
  console.log('Commands:');
  console.log('');
  map(app.commandsMap, (c, n) => {
    const command = require(c);
    console.log(`  ${n.padEnd(14)}${command.description || defaultDesc}`);
  });
  console.log('');
  console.log('App level options:');
  console.log('');
  map(app.appLevelCommandLineOptions, (o, n) => {
    console.log(`  --${kebabCase(n).padEnd(14)} ${o.description || defaultDesc}`);
  });
  console.log('');
  showConfigurableHelpMessages(app);
};
