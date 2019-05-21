import Context from '../../src/Context';
import redirectWorkingDirectory from '../../src/middlewares/redirectWorkingDirectory';
import nullExecutable from '../../src/nullExecutable';

describe('Redirect working directory', () => {

  it("updates context's working directory", async () => {
    const ctx = new Context({
      wd: '/home/clock-man',
      args: ['../weather-maker-man'],
      options: {}
    });
    await redirectWorkingDirectory(ctx, nullExecutable);
    expect(ctx.wd).toBe('/home/weather-maker-man');
  });

  it('removes the first argument from context', async () => {
    const ctx = new Context({
      wd: '/home/clock-man',
      args: ['../weather-maker-man'],
      options: {}
    });
    await redirectWorkingDirectory(ctx, nullExecutable);
    expect(ctx.args).toEqual([]);
  });

  it('does nothing if no arguments in context', async () => {
    const ctx = new Context({
      wd: '/home/clock-man',
      args: [],
      options: {}
    });
    await redirectWorkingDirectory(ctx, nullExecutable);
    expect(ctx.args).toEqual([]);
    expect(ctx.wd).toBe('/home/clock-man');
  });

});
