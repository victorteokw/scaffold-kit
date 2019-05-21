import * as path from 'path';
import Context from '../../../src/Context';
import seekingProjectRoot from '../../../src/middlewares/seekingProjectRoot';
import nullExecutable from '../../../src/nullExecutable';

describe('Seeks for project root', () => {

  it("updates context's working directory if inside project", async () => {
    const ctx = new Context({
      wd: path.join(__dirname, 'example1/sub1'),
      args: [],
      options: {}
    });
    await seekingProjectRoot('root.mark')(ctx, nullExecutable);
    expect(ctx.wd).toBe(path.join(__dirname, 'example1'));
  });

  it("doesn't update context's working directory if project root not found",
  async () => {
    const ctx = new Context({
      wd: path.join(__dirname, 'example1/sub1'),
      args: [],
      options: {}
    });
    await seekingProjectRoot('not.a.root.mark')(ctx, nullExecutable);
    expect(ctx.wd).toBe(path.join(__dirname, 'example1/sub1'));
  });

  it("has default seeking dominant: 'package.json'", async () => {
    const ctx = new Context({
      wd: path.join(__dirname, 'example3/sub2'),
      args: [],
      options: {}
    });
    await seekingProjectRoot()(ctx, nullExecutable);
    expect(ctx.wd).toBe(path.join(__dirname, 'example3'));
  });

});
