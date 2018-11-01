const destinationRegistry = require('./destinationRegistry');

const getDestination = () => {
  return destinationRegistry.get();
};

module.exports = getDestination;
