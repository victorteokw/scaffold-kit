const destinationRegistry = require('./destinationRegistry');

const setDestination = (dir) => {
  destinationRegistry.set(dir);
};

module.exports = setDestination;
