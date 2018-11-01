const templateRegistry = require('./templateRegistry');

const resolveTemplate = (name) => {
  return templateRegistry.resolveTemplatePath(name);
};

module.exports = resolveTemplate;
