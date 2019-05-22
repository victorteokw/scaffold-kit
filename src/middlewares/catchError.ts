import Executable from '../Executable';
import nullExecutable from '../nullExecutable';

type ErrorType = typeof Error | string;
type CatchError = (errorType: ErrorType, handle: Executable) => Executable;

const catchError: CatchError = (errorType: ErrorType, handle: Executable) => {
  return async (ctx, next) => {
    try {
      next(ctx);
    } catch(e) {
      if ((typeof errorType === 'string') && (e.name === errorType)) {
        handle(ctx, nullExecutable);
      } else if (e instanceof (errorType as typeof Error)) {
        handle(ctx, nullExecutable);
      } else {
        throw e;
      }
    }
  }
}

export default catchError;
