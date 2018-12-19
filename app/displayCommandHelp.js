const commandLineUsage = require('command-line-usage');
const map = require('lodash/map');
const kebabCase = require('lodash/kebabCase');
const behaviorHelpSections = require('./behaviorHelpSections');
const getCommandOptions = require('../command/getCommandOptions');

const displayCommandHelp = (app, commandName, command, input) => {

  const desc = 'Description not provided.';

  const sections = [];

  sections.push({
    header: `${app.commandName} ${commandName} (${app.appName} ${app.version})`,
    content: command.description || desc
  });

  if (command.usage) {
    sections.push({
      header: 'Usage',
      content: command.usage
    });
  }

  if (getCommandOptions(app, command, input).length) {
    sections.push({
      header: 'Command options',
      optionList: map(getCommandOptions(app, command, input), (option) => {
        return { ...option, name: kebabCase(option.name) };
      })
    });
  }

  if (app.options && app.options.length) {
    sections.push({
      header: 'Global options',
      optionList: map(app.options, (option) => {
        return { ...option, name: kebabCase(option.name) };
      })
    });
  }

  const behaviors = behaviorHelpSections(app);

  console.log(commandLineUsage([
    ...sections,
    ...behaviors
  ]));
};

module.exports = displayCommandHelp;
