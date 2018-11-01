const destinationRegistry = require('./destinationRegistry');

const hasDestination = () => {
  return destinationRegistry.has();
};

module.exports = hasDestination;
