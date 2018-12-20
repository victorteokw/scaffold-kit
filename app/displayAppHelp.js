const commandLineUsage = require('command-line-usage');
const map = require('lodash/map');
const kebabCase = require('lodash/kebabCase');
const compact = require('lodash/compact');
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

  const commands = Object.keys(app.commands).length ? [{
    header: 'Commands',
    content: map(app.commands, (commandModule, name) => {
      return { name, summary: require(commandModule).description || desc };
    })
  }, {
    content: `Run \`${app.commandName} <command> --help\` \
for help with a specific command.`,
  }] : [{
    header: 'Commands',
    content: `${app.appName} doesn't have any commands yet.`
  }];

  const options = app.options.length ? {
    header: 'Global options',
    optionList: map(app.options, (option) => {
      return { ...option, name: kebabCase(option.name) };
    })
  } : undefined;

  const behaviors = behaviorHelpSections(app);

  console.log(
    commandLineUsage(compact([...intro, ...commands, options, ...behaviors]))
  );
};

module.exports = displayAppHelp;
