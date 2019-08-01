import Executable from '../../../src/Executable';
import applyMiddleware from '../../../src/applyMiddleware';
import acceptSilent from '../../../src/middlewares/acceptSilent';
import * as path from 'path';
import * as fs from 'fs';
import Context from '../../../src/Context';
import executeInstructions from '../../../src/middlewares/executeInstructions';
import nullExecutable from '../../../src/nullExecutable';

describe('execute instructions', () => {

  const wd = path.join(__dirname, 'wd');
  const primary = path.join(wd, 'primary.txt');
  const secondary = path.join(wd, 'secondary.txt');

  afterEach(() => {
    if (fs.existsSync(primary)) {
      fs.unlinkSync(primary);
    }
    if (fs.existsSync(secondary)) {
      fs.unlinkSync(secondary);
    }
  });

  it('runs instructions that being added to the context.', async () => {
    const app: Executable = async (ctx, next) => {
      ctx.createFile({
        'at': 'primary.txt',
        'content': 'content of the newly created file.'
      });
      ctx.createFile({
        'at': 'secondary.txt',
        'content': 'content of the newly created job.'
      });
      await next(ctx);
    };
    const executableApp = applyMiddleware(acceptSilent, app, executeInstructions);
    const context = new Context({
      wd: path.join(__dirname, 'wd'),
      args: [],
      options: { silent: true }
    });
    expect(fs.existsSync(primary)).toBe(false);
    expect(fs.existsSync(secondary)).toBe(false);
    await executableApp(context, nullExecutable);
    expect(fs.existsSync(primary)).toBe(true);
    expect(fs.existsSync(secondary)).toBe(true);
    expect(fs.readFileSync(primary).toString()).toBe('content of the newly created file.');
    expect(fs.readFileSync(secondary).toString()).toBe('content of the newly created job.');
  });

});
