const map = require('lodash/map');
const kebabCase = require('lodash/kebabCase');

const displayBehavioralHelp = (app) => {
  if (!app.behaviorals) return;
  const defaultDesc = 'Description not provided.';
  console.log('Configurables:');
  console.log('');
  map(app.behaviorals, ({ name, description, values, optionName }) => {
    const behaviorName = optionName;
    console.log('  ' + name + ': ' + description);
    console.log('');
    console.log('  Extra configurable options:');
    console.log('');
    map(values, ({ name, description, options }) => {
      console.log(`  --${(kebabCase(behaviorName) + '=' + name).padEnd(14)} ${description}`);
      console.log('');
      map(options, ({ name, description }) => {
        console.log(`    --${kebabCase(name).padEnd(14)} ${description || defaultDesc}`);
      });
      console.log('');
    });
  });
};

module.exports = displayBehavioralHelp;
