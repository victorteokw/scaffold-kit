import execute from '../../src/execute';
import Executable from '../../src/Executable';
import ExecutionInfo from '../../src/ExecutionInfo';
import applyMiddleware from '../../src/applyMiddleware';
import acceptSilent from '../../src/middlewares/acceptSilent';
import * as path from 'path';
import * as fs from 'fs';

describe('executes app', () => {

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
    const app: Executable = (ctx) => {
      ctx.createFile({
        'at': 'primary.txt',
        'content': 'content of the newly created file.'
      });
      ctx.createFile({
        'at': 'secondary.txt',
        'content': 'content of the newly created job.'
      });
    };
    const info: ExecutionInfo = {
      wd: path.join(__dirname, 'wd'),
      args: [],
      options: { silent: true }
    };
    expect(fs.existsSync(primary)).toBe(false);
    expect(fs.existsSync(secondary)).toBe(false);
    await execute(applyMiddleware(acceptSilent, app), info);
    expect(fs.existsSync(primary)).toBe(true);
    expect(fs.existsSync(secondary)).toBe(true);
    expect(fs.readFileSync(primary).toString()).toBe('content of the newly created file.');
    expect(fs.readFileSync(secondary).toString()).toBe('content of the newly created job.');
  });

});
