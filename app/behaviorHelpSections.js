const map = require('lodash/map');
const kebabCase = require('lodash/kebabCase');
const flatten = require('lodash/flatten');

const behaviorHelpSections = (app) => {
  if (!app.behaviorals) return [];

  const desc = 'Description not provided.';

  const mainTitle = {
    header: 'Behaviors',
    content: `${app.appName} supports the following objects that tweaks the \
scaffolding behavior.`
  };

  const behaviorals = map(app.behaviorals, ({
    name, description, values, optionName
  }) => {
    const behavioralName = optionName;
    const behavioralTitle = {
      header: name,
      content: description || desc
    };
    const behavioralSections = map(values, ({ name, description, options }) => {
      return [{
        header: name,
        content: `{italic --${kebabCase(behavioralName)}=${name}} \
${description || desc}`
      }, {
        optionList: map(options, (option) => {
          return { ...option, name: kebabCase(option.name) };
        })
      }];
    });
    return [mainTitle, behavioralTitle, ...flatten(behavioralSections)];
  });

  return flatten(behaviorals);
};

module.exports = behaviorHelpSections;
