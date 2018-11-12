const commandLineUsage = require('command-line-usage');
const map = require('lodash/map');
const kebabCase = require('lodash/kebabCase');
const behaviorHelpSections = require('./behaviorHelpSections');

const displayAppHelp = (app) => {

  const desc = 'Description not provided.';

  const intro = [{
    header: `${app.appName} ${app.version}`,
    content: app.description || desc
  }, {
    header: 'Usage',
    content: `${app.commandName} <command> [args ...] [options ...]`
  }];

  const commands = [{
    header: 'Commands',
    content: map(app.commands, (commandModule, name) => {
      return { name, summary: require(commandModule).description || desc };
    })
  }, {
    content: `Run \`${app.commandName} <command> --help\` \
for help with a specific command.`,
  }];

  const options = {
    header: 'Global options',
    optionList: map(app.options, (option) => {
      return { ...option, name: kebabCase(option.name) };
    })
  };

  const behaviors = behaviorHelpSections(app);

  console.log(commandLineUsage([...intro, ...commands, options, ...behaviors]));
};

module.exports = displayAppHelp;
