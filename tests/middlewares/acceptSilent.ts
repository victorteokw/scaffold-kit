import applyMiddleware from '../../src/applyMiddleware';
import Executable from '../../src/Executable';
import nullExecutable from '../../src/nullExecutable';
import Context from '../../src/Context';
import acceptSilent from '../../src/middlewares/acceptSilent';
import plainReporter from '../../src/reporters/plainReporter';
import silentReporter from '../../src/reporters/silentReporter';

describe('accept silent', () => {
  it('when ctx.options.silent is truthy, alter it with the silent one.', async () => {
    const context = new Context({
      wd: '',
      args: [],
      options: { silent: true },
    });
    expect(context.reporter).toBe(plainReporter);
    await acceptSilent(context, nullExecutable);
    expect(context.reporter).toBe(silentReporter);
  });

  it('when ctx.options.silent is truthy, pass through middleware process.', async () => {
    const callback = jest.fn();
    const after: Executable = (ctx, next) => {
      callback();
      next(ctx);
    };
    const executable = applyMiddleware(acceptSilent, after);
    await executable(
      new Context({ wd: '', args: [], options: { silent: true } }),
      nullExecutable,
    );
    expect(callback.mock.calls.length).toBe(1);
  });

  it('when ctx.options.silent is falsy, do nothing.', async () => {
    const context = new Context({
      wd: '',
      args: [],
      options: { silent: false },
    });
    expect(context.reporter).toBe(plainReporter);
    await acceptSilent(context, nullExecutable);
    expect(context.reporter).toBe(plainReporter);
  });

  it('ctx.options.silent is falsy, pass through middleware process.', async () => {
    const callback = jest.fn();
    const after: Executable = (ctx, next) => {
      callback();
      next(ctx);
    };
    const executable = applyMiddleware(acceptSilent, after);
    await executable(
      new Context({ wd: '', args: [], options: { silent: false } }),
      nullExecutable,
    );
    expect(callback.mock.calls.length).toBe(1);
  });
});
