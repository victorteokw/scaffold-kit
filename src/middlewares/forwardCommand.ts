import Executable from '../Executable';

export class CommandNameError extends Error {
  constructor(...args: any) {
    super(...args);
    this.name = 'CommandNameError';
  }
};

export class CommandNotFoundError extends Error {
  constructor(...args: any) {
    super(...args);
    this.name = 'CommandNotFoundError';
  }
};

interface Command {
  [key: string]: Executable
}

const forwardCommand: (commands: Command) => Executable =
(commands: Command) => {
  return async (ctx, next) => {
    const arg0 = ctx.args[0];
    if (!arg0) {
      throw new CommandNameError('No command name.');
    } else {
      const forwardTo = commands[arg0];
      if (!forwardTo) {
        throw new CommandNotFoundError(`command '${arg0}' not found.`);
      } else {
        await forwardTo(ctx, next);
      }
    }
  }
}

export default forwardCommand;
