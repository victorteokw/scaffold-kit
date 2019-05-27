import applyMiddleware from '../../src/applyMiddleware';
import Executable from '../../src/Executable';
import nullExecutable from '../../src/nullExecutable';
import Context from '../../src/Context';
import acceptMockInstall from '../../src/middlewares/acceptMockInstall';

describe('accept overwrite', () => {
  it("when ctx.options.mockInstall is truthy, alters context's mockInstall value.", async () => {
    const context = new Context({
      wd: '',
      args: [],
      options: { mockInstall: true }
    });
    expect(context.mockInstall).toBe(false);
    await acceptMockInstall(context, nullExecutable);
    expect(context.mockInstall).toBe(true);
  });

  it('when ctx.options.mockInstall is truthy, pass through middleware process.', async () => {
    const callback = jest.fn();
    const after: Executable = (ctx, next) => {
      callback();
      next(ctx);
    };
    const executable = applyMiddleware(acceptMockInstall, after);
    await executable(
      new Context({ wd: '', args: [], options: { mockInstall: true } }),
      nullExecutable
    );
    expect(callback.mock.calls.length).toBe(1);
  });

  it('when ctx.options.mockInstall is falsy, do nothing.', async () => {
    const context = new Context({
      wd: '',
      args: [],
      options: { mockInstall: false }
    });
    expect(context.mockInstall).toBe(false);
    await acceptMockInstall(context, nullExecutable);
    expect(context.mockInstall).toBe(false);
  });

  it('when ctx.options.mockInstall is falsy, pass through middleware process.', async () => {
    const callback = jest.fn();
    const after: Executable = (ctx, next) => {
      callback();
      next(ctx);
    };
    const executable = applyMiddleware(acceptMockInstall, after);
    await executable(
      new Context({ wd: '', args: [], options: { mockInstall: false } }),
      nullExecutable
    );
    expect(callback.mock.calls.length).toBe(1);
  });
});
