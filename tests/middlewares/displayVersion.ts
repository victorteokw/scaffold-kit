import applyMiddleware from '../../src/applyMiddleware';
import Executable from '../../src/Executable';
import displayVersion from '../../src/middlewares/displayVersion';
import nullExecutable from '../../src/nullExecutable';
import { Writable } from 'stream';
import Context from '../../src/Context';

class TestWritableStream extends Writable {
  public received: string = '';
  public _write(chunk: any, enc: string, next: (error?: Error | null) => void) {
    this.received += chunk.toString();
    next();
  }
}

describe('Displays version', () => {

  it("outputs version to process's stdout", async () => {
    const stream = new TestWritableStream();
    const version = displayVersion('GraphQL Joker 1.0.0', stream);
    const callback = jest.fn();
    const after: Executable = (ctx, next) => {
      callback();
      next(ctx);
    };
    const executable = applyMiddleware(
      version,
      after
    );
    await executable(
      new Context({ wd: '', args: [], options: { version: true }}),
      nullExecutable
    );
    expect(callback.mock.calls.length).toBe(0);
    expect(stream.received).toBe('GraphQL Joker 1.0.0\n');
  });

  it("prevents execution of next callback", async () => {
    const stream = new TestWritableStream();
    const version = displayVersion('2.0.0', stream);
    const callback = jest.fn();
    const after: Executable = (ctx, next) => {
      callback();
      next(ctx);
    };
    const executable = applyMiddleware(
      version,
      after
    );
    await executable(
      new Context({ wd: '', args: [], options: { version: true }}),
      nullExecutable
    );
    expect(callback.mock.calls.length).toBe(0);
    expect(stream.received).toBe('2.0.0\n');
  });

  it("appends new line if argument doesn't end with new line", async () => {
    const stream = new TestWritableStream();
    const version = displayVersion('2.0.0', stream);
    const callback = jest.fn();
    const after: Executable = (ctx, next) => {
      callback();
      next(ctx);
    };
    const executable = applyMiddleware(
      version,
      after
    );
    await executable(
      new Context({ wd: '', args: [], options: { version: true }}),
      nullExecutable
    );
    expect(callback.mock.calls.length).toBe(0);
    expect(stream.received).toBe('2.0.0\n');
  });

  it("keep unmodified if argument ends with new line", async () => {
    const stream = new TestWritableStream();
    const version = displayVersion('2.0.0\n\n', stream);
    const callback = jest.fn();
    const after: Executable = (ctx, next) => {
      callback();
      next(ctx);
    };
    const executable = applyMiddleware(
      version,
      after
    );
    await executable(
      new Context({ wd: '', args: [], options: { version: true }}),
      nullExecutable
    );
    expect(callback.mock.calls.length).toBe(0);
    expect(stream.received).toBe('2.0.0\n\n');
  });

});
