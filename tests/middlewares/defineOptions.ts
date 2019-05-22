import Context from '../../src/Context';
import defineOptions from '../../src/middlewares/defineOptions';
import nullExecutable from '../../src/nullExecutable';
import Option from '../../src/Option';
import Options from '../../src/Options';

describe('Defines options on context', () => {

  it("defines new option definitions on context", async () => {
    const context = new Context({
      wd: '/nearest-forever',
      args: ['nice', 'song', 'by', 'michael', 'wong'],
      options: {}
    });
    const optionDefinitions: Options = {
      'help': {
        desc: 'display help message.',
        type: 'boolean'
      },
      'files': {
        desc: 'the files to be processed.',
        type: 'string[]'
      }
    };
    const executable = defineOptions(optionDefinitions);
    await executable(context, nullExecutable);
    expect(context.optionDefinitions).toEqual(optionDefinitions);
  });

  it("merges with existing option definitions on context", async () => {
    const context = new Context({
      wd: '/6165-34522',
      args: ['3455521'],
      options: {}
    });
    const versionRule: Option = {
      desc: 'display version.',
      type: 'boolean'
    };
    context.optionDefinitions.version = versionRule;
    const optionDefinitions: Options = {
      'help': {
        desc: 'display help message.',
        type: 'boolean'
      },
      'files': {
        desc: 'the files to be processed.',
        type: 'string[]'
      }
    };
    const executable = defineOptions(optionDefinitions);
    await executable(context, nullExecutable);
    expect(context.optionDefinitions)
      .toEqual(Object.assign({ version: versionRule }, optionDefinitions));
  });

  it("overwrites option definitions when key conflicting", async () => {
    const context = new Context({
      wd: '/',
      args: ['you', 'are', 'the', 'nearest', 'forever'],
      options: {}
    });
    const helpRule: Option = {
      desc: 'display help message.',
      type: 'boolean'
    };
    const silentRule: Option = {
      desc: 'make this PC silent.',
      type: 'string'
    };
    context.optionDefinitions.help = helpRule;
    context.optionDefinitions.silent = silentRule;
    const optionDefinitions: Options = {
      'help': {
        desc: 'show advertisement based on the index that user inputs.',
        type: 'number'
      },
      'files': {
        desc: 'the files to be processed.',
        type: 'string[]'
      }
    };
    const executable = defineOptions(optionDefinitions);
    await executable(context, nullExecutable);
    expect(context.optionDefinitions)
      .toEqual(Object.assign({ silent: silentRule}, optionDefinitions));
  });

});
