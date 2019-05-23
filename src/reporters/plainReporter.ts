import chalk from 'chalk';
import Reporter from '../Reporter';

enum FileMessage {
  create = "create",
  append = "append",
  update = "update",
  delete = "delete",
  truncate = "truncate",
  rollback = "rollback",
  notExist = "not exist",
  notTruncatable = "not truncatable",
  upToDate = "up-to-date",
  overwrite = "overwrite",
  unchanged = "unchanged",
  exist = "exist"
}

const FileMessageColor = {
  create: "green",
  append: "green",
  update: "green",
  delete: "green",
  truncate: "green",
  rollback: "green",
  notExist: "yellow",
  notTruncatable: "yellow",
  upToDate: "yellow",
  overwrite: "red",
  unchanged: "yellow",
  exist: "yellow"
}

enum DependencyMessage {
  install = "install",
  installed = "installed",
  uninstall = "uninstall",
  notInstalled = "not installed"
}

const DependencyMessageColor = {
  install: "green",
  installed: "yellow",
  uninstall: "green",
  notInstalled: "yellow"
}

enum CommandMessage {
  run = "run",
  failed = "failed"
}

const CommandMessageColor = {
  run: "green",
  failed: "red"
}

const { log } = console;

const report: Reporter = {
  flush: () => {/**/},
  push: ({ message, file, dependency, command, config }) => {
    if (file) {
      const msg = message as FileMessage;
      log(`${
        chalk[FileMessageColor[msg]](message.padStart(12))
      } ${file}`);
    } else if (dependency) {
      const msg = message as DependencyMessage;
      log(`${
        chalk[DependencyMessageColor[msg]](message.padStart(12))
      } ${dependency}`);
    } else if (command) {
      const msg = message as CommandMessage;
      log(`${
        chalk[CommandMessageColor[msg]](message.padStart(12))
      } ${command}`);
    } else if (config) {
      const msg = config as CommandMessage;
      log(`${chalk.green(message.padStart(12))} ${config}`);
    }
  }
}

export default report;
