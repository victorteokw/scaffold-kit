const map = require('lodash/map');
const kebabCase = require('lodash/kebabCase');

module.exports = (app) => {
  if (!app.behaviorsMap) return;
  const defaultDesc = 'Description not provided.';
  console.log('Configurables:');
  console.log('');
  map(app.behaviorsMap, (behaviorMap, behaviorName) => {
    console.log('  ' + behaviorMap.name + ': ' + behaviorMap.description);
    console.log('');
    console.log('  Extra configurable options:');
    console.log('');
    map(behaviorMap.items, (item, itemName) => {
      console.log(`  --${(kebabCase(behaviorName) + '=' + itemName).padEnd(14)} ${item.description}`);
      console.log('');
      map(item.extraOptions, (option, optionName) => {
        console.log(`    --${kebabCase(optionName).padEnd(14)} ${option.description || defaultDesc}`);
      });
      console.log('');
    });
  });
};
