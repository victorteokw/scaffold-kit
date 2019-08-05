import applyMiddleware from './applyMiddleware';
import Plugable from './Plugable';
import nullExecutable from './nullExecutable';

function chainMiddleware<T>(...middlewares: Array<Plugable<T>>): Plugable<T> {
  const middleware = applyMiddleware(...middlewares);
  return async (ctx, next) => {
    await middleware(ctx, nullExecutable);
    await next(ctx);
  };
};

export default chainMiddleware;
