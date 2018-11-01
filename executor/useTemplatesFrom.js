const templateRegistry = require('./templateRegistry');

const useTemplatesFrom = (dir) => {
  templateRegistry.add(dir);
};

module.exports = useTemplatesFrom;
