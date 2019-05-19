import Context from "./Context";
import nullExecutable from "./nullExecutable";
import Plugable from './Plugable';
import PlugableCallback from './PlugableCallback';

function applyOneMiddleware<T>
  (original: Plugable<T>, middleware: Plugable<T>): Plugable<T> {
  return (ctx: T, next: Plugable<T>) => {
    return middleware(ctx, (innerCtx: T) => {
      return original(innerCtx, nullExecutable);
    });
  };
};

function applyMiddleware<T>
  (original: Plugable<T>, ...middlewares: Array<Plugable<T>>): Plugable<T> {
  let applied = original;
  for (const middleware of middlewares) {
    applied = applyOneMiddleware(applied, middleware);
  }
  return applied;
};

export default applyMiddleware;
