import applyMiddleware from '../applyMiddleware';
import nullExecutable from '../nullExecutable';
import Plugable from '../Plugable';
import PlugableCallback from '../PlugableCallback';

describe('Apply middleware', () => {
  it('surround the original with the new', async () => {
    const list: number[] = [];
    const executable: Plugable<number> = async (ctx, next) => {
      list.push(2);
      await next(ctx);
      list.push(3);
    };
    const middleware: Plugable<number> = async (ctx, next) => {
      list.push(1);
      await next(ctx);
      list.push(4);
    };
    const applied = applyMiddleware(executable, middleware);
    await applied(2, nullExecutable);
    expect(list).toEqual([1, 2, 3, 4]);
  });
});
