import applyMiddleware from '../../src/applyMiddleware';
import prefixGenerate from '../../src/middlewares/prefixGenerate';
import forwardCommand from '../../src/middlewares/forwardCommand';
import Context from '../../src/Context';
import nullExecutable from '../../src/nullExecutable';

describe('Prefix generate', () => {
  it("pass thru if the first arg token is 'generate'", async () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const app = applyMiddleware(prefixGenerate, forwardCommand({
      'command1': (ctx, next) => {
        callback1();
        ctx.installDependency({ package: 'lodash', version: 'latest' });
      },
      'command2': (ctx, next) => {
        callback2();
      }
    }));
    const context = new Context({
      'wd': 'never-mind',
      args: ['generate', 'command1'],
      options: {}
    });
    await app(context, nullExecutable);
    expect(callback1.mock.calls.length).toBe(1);
    expect(callback2.mock.calls.length).toBe(0);
    expect(context.executor.instructions.length).toBe(1);
    expect(context.executor.instructions[0]).toEqual({
      type: 'installDependency',
      detail: { package: 'lodash', version: 'latest', dev: undefined, mock: false, wd: 'never-mind' }
    });
  });

  it("pass thru if the first arg token is not 'generate'", async () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const app = applyMiddleware(prefixGenerate, forwardCommand({
      'command1': (ctx, next) => {
        callback1();
        ctx.installDependency({ package: 'lodash', version: 'latest' });
      },
      'command2': (ctx, next) => {
        callback2();
      }
    }));
    const context = new Context({
      'wd': 'never-mind',
      args: ['command1'],
      options: {}
    });
    await app(context, nullExecutable);
    expect(callback1.mock.calls.length).toBe(1);
    expect(callback2.mock.calls.length).toBe(0);
    expect(context.executor.instructions.length).toBe(1);
    expect(context.executor.instructions[0]).toEqual({
      type: 'installDependency',
      detail: { package: 'lodash', version: 'latest', dev: undefined, mock: false, wd: 'never-mind' }
    });
  });
});
