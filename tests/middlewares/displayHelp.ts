import applyMiddleware from '../../src/applyMiddleware';
import Executable from '../../src/Executable';
import displayHelp from '../../src/middlewares/displayHelp';
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

describe('Displays help', () => {

  it("outputs help to process's stdout", async () => {
    const stream = new TestWritableStream();
    const help = displayHelp('usage', stream);
    const callback = jest.fn();
    const after: Executable = (ctx, next) => {
      callback();
      next(ctx);
    };
    const executable = applyMiddleware(
      help,
      after
    );
    await executable(
      new Context({ wd: '', args: [], options: { help: true }}),
      nullExecutable
    );
    expect(callback.mock.calls.length).toBe(0);
    expect(stream.received).toBe('usage\n');
  });

  it("prevents execution of next callback", async () => {
    const stream = new TestWritableStream();
    const help = displayHelp('usage', stream);
    const callback = jest.fn();
    const after: Executable = (ctx, next) => {
      callback();
      next(ctx);
    };
    const executable = applyMiddleware(
      help,
      after
    );
    await executable(
      new Context({ wd: '', args: [], options: { help: true }}),
      nullExecutable
    );
    expect(callback.mock.calls.length).toBe(0);
    expect(stream.received).toBe('usage\n');
  });

  it("appends new line if argument doesn't end with new line", async () => {
    const stream = new TestWritableStream();
    const help = displayHelp('usage', stream);
    const callback = jest.fn();
    const after: Executable = (ctx, next) => {
      callback();
      next(ctx);
    };
    const executable = applyMiddleware(
      help,
      after
    );
    await executable(
      new Context({ wd: '', args: [], options: { help: true }}),
      nullExecutable
    );
    expect(callback.mock.calls.length).toBe(0);
    expect(stream.received).toBe('usage\n');
  });

  it("keep unmodified if argument ends with new line", async () => {
    const stream = new TestWritableStream();
    const help = displayHelp('usage\n\n', stream);
    const callback = jest.fn();
    const after: Executable = (ctx, next) => {
      callback();
      next(ctx);
    };
    const executable = applyMiddleware(
      help,
      after
    );
    await executable(
      new Context({ wd: '', args: [], options: { help: true }}),
      nullExecutable
    );
    expect(callback.mock.calls.length).toBe(0);
    expect(stream.received).toBe('usage\n\n');
  });

});
