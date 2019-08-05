import Plugable from './Plugable';
import PlugableCallback from './PlugableCallback';

function applySingle<T>(lhs: Plugable<T>, rhs: Plugable<T>): Plugable<T> {
  return (ctx: T, next: PlugableCallback<T>) => {
    return lhs(ctx, (innerCtx: T) => {
      return rhs(innerCtx, next);
    });
  };
};

function applyMiddleware<T>(...middlewares: Array<Plugable<T>>): Plugable<T> {
  const { length } = middlewares;
  let applied = middlewares[length - 1];
  for (let i = length - 2; i >= 0; i--) {
    applied = applySingle(middlewares[i], applied);
  }
  return applied;
};

export default applyMiddleware;
