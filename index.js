const assign = require('lodash/assign');

const app = require('./app');
const command = require('./command');
const executor = require('./executor');

module.exports = assign({}, app, command, executor);
