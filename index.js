const assign = require('lodash/assign');

const app = require('./app');
const command = require('./command');
const executor = require('./executor');

const { version } = require('./package.json');

module.exports = assign({}, app, command, executor, { version });
