import Executable from '../Executable';
import nullExecutable from '../nullExecutable';

// tslint:disable-next-line: ban-types
type ErrorType = Function | string;
type CatchError = (errorType: ErrorType, handle: Executable) => Executable;

const catchError: CatchError = (errorType: ErrorType, handle: Executable) => {
  return async (ctx, next) => {
    try {
      await next(ctx);
    } catch(e) {
      if ((typeof errorType === 'string') && (e.name === errorType)) {
        handle(ctx, nullExecutable);
      } else if ((typeof errorType === 'function') &&
        e instanceof (errorType as typeof Error)) {
        handle(ctx, nullExecutable);
      } else {
        throw e;
      }
    }
  }
}

export default catchError;
