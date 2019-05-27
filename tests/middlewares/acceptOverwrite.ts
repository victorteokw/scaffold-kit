import applyMiddleware from '../../src/applyMiddleware';
import Executable from '../../src/Executable';
import nullExecutable from '../../src/nullExecutable';
import Context from '../../src/Context';
import acceptOverwrite from '../../src/middlewares/acceptOverwrite';

describe('accept overwrite', () => {
  it("when ctx.options.overwrite is truthy, alters context's overwrite value.", async () => {
    const context = new Context({
      wd: '',
      args: [],
      options: { overwrite: true }
    });
    expect(context.overwrite).toBe(false);
    await acceptOverwrite(context, nullExecutable);
    expect(context.overwrite).toBe(true);
  });

  it('when ctx.options.overwrite is truthy, pass through middleware process.', async () => {
    const callback = jest.fn();
    const after: Executable = (ctx, next) => {
      callback();
      next(ctx);
    };
    const executable = applyMiddleware(acceptOverwrite, after);
    await executable(
      new Context({ wd: '', args: [], options: { overwrite: true } }),
      nullExecutable
    );
    expect(callback.mock.calls.length).toBe(1);
  });

  it('when ctx.options.overwrite is falsy, do nothing.', async () => {
    const context = new Context({
      wd: '',
      args: [],
      options: { overwrite: false }
    });
    expect(context.overwrite).toBe(false);
    await acceptOverwrite(context, nullExecutable);
    expect(context.overwrite).toBe(false);
  });

  it('when ctx.options.overwrite is falsy, pass through middleware process.', async () => {
    const callback = jest.fn();
    const after: Executable = (ctx, next) => {
      callback();
      next(ctx);
    };
    const executable = applyMiddleware(acceptOverwrite, after);
    await executable(
      new Context({ wd: '', args: [], options: { overwrite: false } }),
      nullExecutable
    );
    expect(callback.mock.calls.length).toBe(1);
  });
});
