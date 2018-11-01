const mapValues = require('lodash/mapValues');
const map = require('lodash/map');
const kebabCase = require('lodash/kebabCase');
const showConfigurableHelpMessages = require('./showConfigurableHelpMessages');

module.exports = (app, commandName, command) => {
  const appOptionDescs = mapValues(app.appLevelCommandLineOptions, 'description');
  const commandOptionDescs = mapValues(command.commandLineOptions, 'description');
  console.log('');
  console.log(`${app.appName} ${app.version}`);
  console.log('');
  console.log(`Command: ${app.commandName} ${commandName}`);
  console.log('');
  console.log(`Description: ${command.description}`);
  console.log('');
  if (command.usage) {
    console.log('Usage:');
    console.log('');
    console.log(`${command.usage}`);
    console.log('');
  }
  console.log('Command options:');
  console.log('');
  map(commandOptionDescs, (o, k) => {
    console.log(`  --${kebabCase(k).padEnd(14)}\t${o}`);
  });
  console.log('');
  console.log('App level options:');
  console.log('');
  map(appOptionDescs, (o, k) => {
    console.log(`  --${kebabCase(k).padEnd(14)}\t${o}`);
  });
  console.log('');
  showConfigurableHelpMessages(app);
};
