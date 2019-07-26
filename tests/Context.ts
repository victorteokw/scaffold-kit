import Context from '../src/Context';
import Executor from '../src/Executor';
import { plainReporter, silentReporter } from '../src/reporters';

describe('the context object', () => {

  describe('has middleware extension fields', () => {
    describe('has field optionDefinitions', () => {
      it('can be set to OptionRules value and can be get', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        context.optionDefinitions = {
          'newOpt': {
            type: 'string',
            desc: 'the new option.'
          }
        };
        expect(context.optionDefinitions).toEqual({
          'newOpt': {
            type: 'string',
            desc: 'the new option.'
          }
        });
      });

      it('has default value empty object', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        expect(context.optionDefinitions).toEqual({});
      });
    });

    describe('has field savedOptions', () => {
      it('can be set to Options value and can be get', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        context.savedOptions = {
          'bestTank': 'metal-slug'
        };
        expect(context.savedOptions).toEqual({
          'bestTank': 'metal-slug'
        });
      });

      it('has default value empty object', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        expect(context.savedOptions).toEqual({});
      });
    });
  });

  describe('has user execution information fields', () => {
    describe('has field wd', () => {
      it('can be set to string value and can be get', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        context.wd = '/wd2';
        expect(context.wd).toBe('/wd2');
      });

      it('has default value that user passed in', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        expect(context.wd).toBe('/wd');
      });
    });

    describe('has field args', () => {
      it('can be set to array of string value and can be get', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        context.args = ['command', 'arg1'];
        expect(context.args).toEqual(['command', 'arg1']);
      });

      it('has default value that user passed in', () => {
        const context = new Context({ wd: '/wd', args: ['ok'], options: {}});
        expect(context.args).toEqual(['ok']);
      });
    });

    describe('has field options', () => {
      it('can be set to Options value and can be get', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        context.options = { 'key2': 'value2' };
        expect(context.options).toEqual({ 'key2': 'value2' });
      });

      it('has default value that user passed in', () => {
        const context = new Context({ wd: '/wd', args: [], options: { 'key1': 'value1' }});
        expect(context.options).toEqual({ 'key1': 'value1' });
      });
    });
  });

  describe('has context option fields', () => {
    describe('has field overwrite', () => {
      it('can be set to boolean value and can be get', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        context.overwrite = true;
        expect(context.overwrite).toBe(true);
      });

      it('has default value false', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        expect(context.overwrite).toBe(false);
      });
    });

    describe('has field mockInstall', () => {
      it('can be set to boolean value and can be get', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        context.mockInstall = true;
        expect(context.mockInstall).toBe(true);
      });

      it('has default value false', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        expect(context.mockInstall).toBe(false);
      });
    });
  });

  describe('has execution behavior fields', () => {
    describe('has field disableFlush', () => {
      it('can be set to boolean value and can be get', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        context.disableFlush = true;
        expect(context.disableFlush).toBe(true);
      });

      it('has default value false', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        expect(context.disableFlush).toBe(false);
      });
    });

    describe('has field reporter', () => {
      it('can be set to Reporter value and can be get', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        context.reporter = silentReporter;
        expect(context.reporter).toBe(silentReporter);
      });

      it('has default value plainReporter', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        expect(context.reporter).toBe(plainReporter);
      });
    });

    describe('has field executor', () => {
      it('is readonly', () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        expect(context.executor).toBeInstanceOf(Executor);
      });

      it("on creation, it's a brand new executor", () => {
        const context = new Context({ wd: '/wd', args: [], options: {}});
        expect(context.executor).toBeInstanceOf(Executor);
        expect(context.executor.instructions).toEqual([]);
      });
    });
  });
});
