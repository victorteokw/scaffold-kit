import applyMiddleware from '../../src/applyMiddleware';
import Context from '../../src/Context';
import Executable from '../../src/Executable';
import catchError from '../../src/middlewares/catchError';
import forwardCommand, {
  CommandNameError
} from '../../src/middlewares/forwardCommand';
import nullExecutable from '../../src/nullExecutable';

describe('Catches error', () => {

  it("catches string error and redirect to handler", async () => {
    const handlerCallback = jest.fn();
    const commandCallback = jest.fn();
    const catcher = catchError('CommandNameError', (ctx, next) => {
      handlerCallback();
    });
    const context = new Context({
      wd: '/usr/who',
      args: [],
      options: {}
    });
    const executable = forwardCommand({
      'commanda': async (ctx, next) => {
        commandCallback();
      }
    });
    const app = applyMiddleware(catcher, executable);
    await app(context, nullExecutable);
    expect(commandCallback.mock.calls.length).toBe(0);
    expect(handlerCallback.mock.calls.length).toBe(1);
  });

  it("catches error class error and redirect to handler", async () => {
    const handlerCallback = jest.fn();
    const commandCallback = jest.fn();
    const catcher = catchError(CommandNameError, (ctx, next) => {
      handlerCallback();
    });
    const context = new Context({
      wd: '/usr/who',
      args: [],
      options: {}
    });
    const executable = forwardCommand({
      'commanda': async (ctx, next) => {
        commandCallback();
      }
    });
    const app = applyMiddleware(catcher, executable);
    await app(context, nullExecutable);
    expect(commandCallback.mock.calls.length).toBe(0);
    expect(handlerCallback.mock.calls.length).toBe(1);
  });

  it("passes error up if string error is not recognized", async () => {
    const handlerCallback = jest.fn();
    const commandCallback = jest.fn();
    const catcher = catchError('MyError', (ctx, next) => {
      handlerCallback();
    });
    const context = new Context({
      wd: '/usr/who',
      args: [],
      options: {}
    });
    const executable = forwardCommand({
      'commanda': async (ctx, next) => {
        commandCallback();
      }
    });
    const app = applyMiddleware(catcher, executable);
    await expect(app(context, nullExecutable))
    .rejects.toBeInstanceOf(CommandNameError);
    expect(commandCallback.mock.calls.length).toBe(0);
    expect(handlerCallback.mock.calls.length).toBe(0);
  });

  it("passes error up if error class error is not recognized", async () => {
    const handlerCallback = jest.fn();
    const commandCallback = jest.fn();
    const catcher = catchError(CommandNameError, (ctx, next) => {
      handlerCallback();
    });
    const context = new Context({
      wd: '/usr/who',
      args: [],
      options: {}
    });
    const executable: Executable = (ctx, next) => {
      throw new Error("you won't recognize me.");
    };
    const app = applyMiddleware(catcher, executable);
    await expect(app(context, nullExecutable))
    .rejects.toBeInstanceOf(Error);
    expect(commandCallback.mock.calls.length).toBe(0);
    expect(handlerCallback.mock.calls.length).toBe(0);
  });

});
