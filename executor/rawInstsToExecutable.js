const each = require('lodash/each');

const rawInstsToExecutable = (rawInsts) => {
  const files = {};
  const dependencies = {};
  const commands = [];
  const directories = {};

  each(rawInsts, ({ name, params }) => {
    switch (name) {
      // File instructions
      case 'createFile': {
        if (!files[params.at]) files[params.at] = [];
        if (!params.content && !params.from) {
          params.from = params.at;
        }
        files[params.at].push({ name: 'createFile', params });
        break;
      }
      case 'deleteFile': {
        if (!files[params.at]) files[params.at] = [];
        files[params.at].push({ name: 'deleteFile', params });
        break;
      }
      case 'appendFile': {
        if (!files[params.at]) files[params.at] = [];
        if (!params.content && !params.from) {
          params.from = params.at;
        }
        files[params.at].push({ name: 'appendFile', params });
        break;
      }
      case 'detachFromFile': {
        if (!files[params.at]) files[params.at] = [];
        if (!params.content && !params.from) {
          params.from = params.at;
        }
        files[params.at].push({ name: 'detachFromFile', params });
        break;
      }
      case 'updateJSONFile': {
        if (!files[params.at]) files[params.at] = [];
        files[params.at].push({ name: 'updateJSONFile', params });
        break;
      }
      case 'rollbackJSONFile': {
        if (!files[params.at]) files[params.at] = [];
        files[params.at].push({ name: 'rollbackJSONFile', params });
        break;
      }
      // Dependency instructions
      case 'installDependency': {
        dependencies[params.package] = { name: 'installDependency', params };
        break;
      }
      case 'removeDependency': {
        dependencies[params.package] = { name: 'removeDependency', params };
        break;
      }
      // Command instructions
      case 'runShellCommand': {
        commands.push({ name: 'runShellCommand', params });
        break;
      }
      // Handle git keep directories
      case 'keepDirectoryInGit': {
        directories[params.at] = { name: 'keepDirectoryInGit', params };
        break;
      }
    }
  });
  return {
    files,
    dependencies,
    commands,
    directories
  };
};

module.exports = rawInstsToExecutable;
