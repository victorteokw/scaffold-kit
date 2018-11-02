const each = require('lodash/each');

const rawInstsToExecutable = (rawInsts) => {
  const files = {};
  const dependencies = {};
  const commands = [];

  each(rawInsts, ({ name, params }) => {
    switch (name) {
      // File instructions
      case 'createFile': {
        if (!files[params.at]) files[params.at] = [];
        if (!params.content && !params.from) {
          params.from = params.at;
        }
        files[params.at].push({ name: 'createFile', params });
      }
      case 'deleteFile': {
        if (!files[params.at]) files[params.at] = [];
        files[params.at].push({ name: 'deleteFile', params });
      }
      case 'appendFile': {
        if (!files[params.at]) files[params.at] = [];
        if (!params.content && !params.from) {
          params.from = params.at;
        }
        files[params.at].push({ name: 'appendFile', params });
      }
      case 'detachFromFile': {
        if (!files[params.at]) files[params.at] = [];
        if (!params.content && !params.from) {
          params.from = params.at;
        }
        files[params.at].push({ name: 'detachFromFile', params });
      }
      case 'updateJSONFile': {
        if (!files[params.at]) files[params.at] = [];
        files[params.at].push({ name: 'updateJSONFile', params });
      }
      case 'rollbackJSONFile': {
        if (!files[params.at]) files[params.at] = [];
        files[params.at].push({ name: 'rollbackJSONFile', params });
      }
      // Dependency instructions
      case 'installDependency': {
        dependencies[params.package] = { name: 'installDependency', params };
      }
      case 'removeDependency': {
        dependencies[params.package] = { name: 'removeDependency', params };
      }
      // Command instructions
      case 'runShellCommand': {
        commands.push({ name: 'runShellCommand', params });
      }
    }
  });
};

module.exports = rawInstsToExecutable;
