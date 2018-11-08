const map = require('lodash/map');
const kebabCase = require('lodash/kebabCase');
const displayBehavioralHelp = require('./displayBehavioralHelp');
const getCommandOptions = require('../command/getCommandOptions');

const displayCommandHelp = (app, commandName, command, input) => {
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
  map(getCommandOptions(app, command, input), ({ name, description }) => {
    console.log(`  --${kebabCase(name).padEnd(14)}\t${description}`);
  });
  console.log('');
  console.log('App level options:');
  console.log('');
  map(app.options, ({ name, description }) => {
    console.log(`  --${kebabCase(name).padEnd(14)}\t${description}`);
  });
  console.log('');
  displayBehavioralHelp(app);
};

module.exports = displayCommandHelp;
