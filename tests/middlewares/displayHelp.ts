import chalk from 'chalk';
import { Writable } from 'stream';
import applyMiddleware from '../../src/applyMiddleware';
import displayHelp from '../../src/middlewares/displayHelp';
import nullExecutable from '../../src/nullExecutable';
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
    const context = new Context({
      wd: '/home/luen-sai-ching-lui',
      args: [],
      options: {}
    });
    context.helpSections = [{
      key: 'title',
      title: 'Title',
      content: 'content 1.'
    }, {
      key: 'usage',
      title: 'Usage',
      content: 'content 2.'
    }];
    const executable = applyMiddleware(displayHelp(stream));
    await executable(context, nullExecutable);
    expect(stream.received).toBe(chalk`\n{bold.underline Title}\n\n  content 1.\n\n{bold.underline Usage}\n\n  content 2.\n\n`);
  });

});
