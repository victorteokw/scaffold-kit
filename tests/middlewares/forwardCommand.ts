import * as path from 'path';
import Context from '../../src/Context';
import forwardCommand, {
  CommandNameError,
  CommandNotFoundError
} from '../../src/middlewares/forwardCommand';
import nullExecutable from '../../src/nullExecutable';

describe('Forwards command', () => {

  it("to the correct executable in the map", async () => {
    const context = new Context({
      wd: '/usr/who',
      args: ['commandb', 'arg1', 'arg2'],
      options: {}
    });
    const aCallback = jest.fn();
    const bCallback = jest.fn();
    const cCallback = jest.fn();
    const executable = forwardCommand({
      'commanda': async (ctx, next) => {
        aCallback();
      },
      'commandb': async (ctx, next) => {
        bCallback();
      },
      'commandc': async (ctx, next) => {
        cCallback();
      }
    });
    await executable(context, nullExecutable);
    expect(aCallback.mock.calls.length).toBe(0);
    expect(bCallback.mock.calls.length).toBe(1);
    expect(cCallback.mock.calls.length).toBe(0);
  });

  it("throws CommandNameError if no left arguments", async () => {
    const context = new Context({
      wd: '/usr/who',
      args: [],
      options: {}
    });
    const executable = forwardCommand({
      'commanda': async (ctx, next) => {/**/},
      'commandb': async (ctx, next) => {/**/},
      'commandc': async (ctx, next) => {/**/}
    });
    await expect(executable(context, nullExecutable))
      .rejects.toBeInstanceOf(CommandNameError);
  });

  it("throws CommandNotFoundError if command not in the map", async () => {
    const context = new Context({
      wd: '/usr/who',
      args: ['commandd'],
      options: {}
    });
    const executable = forwardCommand({
      'commanda': async (ctx, next) => {/**/},
      'commandb': async (ctx, next) => {/**/},
      'commandc': async (ctx, next) => {/**/}
    });
    await expect(executable(context, nullExecutable))
      .rejects.toBeInstanceOf(CommandNotFoundError);
  });

});
