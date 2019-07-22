import * as os from 'os';
import Context from '../../src/Context';
import redirectWorkingDirectory from '../../src/middlewares/redirectWorkingDirectory';
import nullExecutable from '../../src/nullExecutable';

describe('Redirect working directory', () => {

  it("updates context's working directory", async () => {
    const ctx = new Context({
      wd: os.platform() === 'win32' ? 'C:\\Users\\Clock Man' : '/home/clock-man',
      args: [os.platform() === 'win32' ? '..\\Weather Maker Man' : '../weather-maker-man'],
      options: {}
    });
    await redirectWorkingDirectory(ctx, nullExecutable);
    expect(ctx.wd).toBe(os.platform() === 'win32' ? 'C:\\Users\\Weather Maker Man' : '/home/weather-maker-man');
  });

  it('removes the first argument from context', async () => {
    const ctx = new Context({
      wd: os.platform() === 'win32' ? 'C:\\Users\\Clock Man' : '/home/clock-man',
      args: ['..\\Weather Maker Man'],
      options: {}
    });
    await redirectWorkingDirectory(ctx, nullExecutable);
    expect(ctx.args).toEqual([]);
  });

  it('does nothing if no arguments in context', async () => {
    const ctx = new Context({
      wd: os.platform() === 'win32' ? 'C:\\Users\\Clock Man' : '/home/clock-man',
      args: [],
      options: {}
    });
    await redirectWorkingDirectory(ctx, nullExecutable);
    expect(ctx.args).toEqual([]);
    expect(ctx.wd).toBe(os.platform() === 'win32' ? 'C:\\Users\\Clock Man' : '/home/clock-man');
  });

});
