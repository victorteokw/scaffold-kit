import applyMiddleware from '../applyMiddleware';
import nullExecutable from '../nullExecutable';
import Plugable from '../Plugable';

describe('Apply middleware', () => {

  it('surrounds the right hand side with the left hand side', async () => {
    let retval: number[] = [];
    const executable: Plugable<number[]> = async (ctx, next) => {
      ctx.push(2);
      await next(ctx);
      ctx.push(3);
      retval = ctx;
    };
    const middleware: Plugable<number[]> = async (ctx, next) => {
      ctx.push(1);
      await next(ctx);
      ctx.push(4);
      retval = ctx;
    };
    const applied = applyMiddleware(middleware, executable);
    await applied([], nullExecutable);
    expect(retval).toEqual([1, 2, 3, 4]);
  });

  it('supports many middlewares', async () => {
    let retval: number[] = [];
    const original: Plugable<number[]> = async (ctx, next) => {
      ctx.push(3);
      await next(ctx);
      ctx.push(4);
      retval = ctx;
    };
    const middleware1: Plugable<number[]> = async (ctx, next) => {
      ctx.push(1);
      await next(ctx);
      ctx.push(6);
      retval = ctx;
    };
    const middleware2: Plugable<number[]> = async (ctx, next) => {
      ctx.push(2);
      await next(ctx);
      ctx.push(5);
      retval = ctx;
    };
    const applied = applyMiddleware(middleware1, middleware2, original);
    await applied([], nullExecutable);
    expect(retval).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('shares context', async () => {
    interface MyContext {
      key1?: string;
      key2?: string;
      key3?: string;
    }
    let retval: MyContext | undefined;
    const original: Plugable<MyContext> = async (ctx, next) => {
      ctx.key1 = 'val1';
      await next(ctx);
    };
    const middleware1: Plugable<MyContext> = async (ctx, next) => {
      ctx.key2 = 'val2';
      await next(ctx);
      retval = ctx;
    };
    const middleware2: Plugable<MyContext> = async (ctx, next) => {
      ctx.key3 = 'val3';
      await next(ctx);
    };
    const applied = applyMiddleware(middleware1, middleware2, original);
    await applied({}, nullExecutable);
    expect(retval).toEqual({ key1: 'val1', key2: 'val2', key3: 'val3' });
  });
});
