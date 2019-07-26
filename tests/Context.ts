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

describe('context instruction helper methods', () => {
  describe('createFile', () => {
    it("creates a new createFile instruction in the executor's instruction stack", () => {
      const context = new Context({ 'wd': '/users/victor', args: [], options: {}});
      context.createFile({
        at: '1.txt',
        from: '/users/pinkle/2.txt'
      });
      expect(context.executor.instructions.length).toBe(1);
      expect(context.executor.instructions[0]).toEqual({
        type: 'createFile',
        detail: {
          at: '/users/victor/1.txt',
          from: '/users/pinkle/2.txt',
          overwrite: false,
          content: undefined,
          context: undefined
        }
      });
    });

    it("expends from location if it's inside template dir.", () => {
      const context = new Context({ 'wd': '/users/victor', args: [], options: {}});
      context.useTemplateFrom('/users/pinkle', () => {
        context.createFile({
          at: '1.txt',
          from: '2.txt'
        });
      });
      expect(context.executor.instructions.length).toBe(1);
      expect(context.executor.instructions[0]).toEqual({
        type: 'createFile',
        detail: {
          at: '/users/victor/1.txt',
          from: '/users/pinkle/2.txt',
          overwrite: false,
          content: undefined,
          context: undefined
        }
      });
    });

    // TODO: overwrite when context setting is true and local setting is undefined
    // TODO: overwrite when overwrite is set
    // TODO: not overwrite when local is false while context setting is true
  });

  describe('deleteFile', () => {
    it("creates a new deleteFile instruction in the executor's instruction stack", () => {
      const context = new Context({ 'wd': '/users/victor', args: [], options: {}});
      context.deleteFile({
        at: '1.txt'
      });
      expect(context.executor.instructions.length).toBe(1);
      expect(context.executor.instructions[0]).toEqual({
        type: 'deleteFile',
        detail: {
          at: '/users/victor/1.txt',
          from: undefined,
          overwrite: false,
          content: undefined,
          context: undefined
        }
      });
    });
  });

  describe('appendFile', () => {
    it("creates a new appendFile instruction in the executor's instruction stack", () => {
      const context = new Context({ 'wd': '/users/victor', args: [], options: {}});
      context.appendFile({
        at: '1.txt',
        from: '/users/pinkle/2.txt'
      });
      expect(context.executor.instructions.length).toBe(1);
      expect(context.executor.instructions[0]).toEqual({
        type: 'appendFile',
        detail: {
          at: '/users/victor/1.txt',
          from: '/users/pinkle/2.txt',
          content: undefined,
          context: undefined
        }
      });
    });

    it("expends from location if it's inside template dir.", () => {
      const context = new Context({ 'wd': '/users/victor', args: [], options: {}});
      context.useTemplateFrom('/users/pinkle', () => {
        context.appendFile({
          at: '1.txt',
          from: '2.txt'
        });
      });
      expect(context.executor.instructions.length).toBe(1);
      expect(context.executor.instructions[0]).toEqual({
        type: 'appendFile',
        detail: {
          at: '/users/victor/1.txt',
          from: '/users/pinkle/2.txt',
          content: undefined,
          context: undefined
        }
      });
    });
  });

  describe('detachFromFile', () => {
    it("creates a new detachFromFile instruction in the executor's instruction stack", () => {
      const context = new Context({ 'wd': '/users/victor', args: [], options: {}});
      context.detachFromFile({
        at: '1.txt',
        from: '/users/pinkle/2.txt'
      });
      expect(context.executor.instructions.length).toBe(1);
      expect(context.executor.instructions[0]).toEqual({
        type: 'detachFromFile',
        detail: {
          at: '/users/victor/1.txt',
          from: '/users/pinkle/2.txt',
          content: undefined,
          context: undefined
        }
      });
    });

    it("expends from location if it's inside template dir.", () => {
      const context = new Context({ 'wd': '/users/victor', args: [], options: {}});
      context.useTemplateFrom('/users/pinkle', () => {
        context.detachFromFile({
          at: '1.txt',
          from: '2.txt'
        });
      });
      expect(context.executor.instructions.length).toBe(1);
      expect(context.executor.instructions[0]).toEqual({
        type: 'detachFromFile',
        detail: {
          at: '/users/victor/1.txt',
          from: '/users/pinkle/2.txt',
          content: undefined,
          context: undefined
        }
      });
    });
  });

  describe('updateFile', () => {
    it("creates a new updateFile instruction in the executor's instruction stack", () => {
      const context = new Context({ 'wd': '/users/victor', args: [], options: {}});
      const updator = (s: string) => s;

      context.updateFile({
        at: '1.txt',
        updator,
        rollbacker: updator
      });
      expect(context.executor.instructions.length).toBe(1);
      expect(context.executor.instructions[0]).toEqual({
        type: 'updateFile',
        detail: {
          at: '/users/victor/1.txt',
          updator,
          rollbacker: updator
        }
      });
    });
  });

  describe('rollbackFile', () => {
    it("creates a new rollbackFile instruction in the executor's instruction stack", () => {
      const context = new Context({ 'wd': '/users/victor', args: [], options: {}});
      const updator = (s: string) => s;

      context.rollbackFile({
        at: '1.txt',
        updator,
        rollbacker: updator
      });
      expect(context.executor.instructions.length).toBe(1);
      expect(context.executor.instructions[0]).toEqual({
        type: 'rollbackFile',
        detail: {
          at: '/users/victor/1.txt',
          updator,
          rollbacker: updator
        }
      });
    });
  });

  describe('updateJSONFile', () => {
    it("creates a new updateJSONFile instruction in the executor's instruction stack", () => {
      const context = new Context({ 'wd': '/users/victor', args: [], options: {}});
      const updator = (a: any) => a;

      context.updateJSONFile({
        at: '1.txt',
        updator,
        rollbacker: updator
      });
      expect(context.executor.instructions.length).toBe(1);
      expect(context.executor.instructions[0]).toEqual({
        type: 'updateJSONFile',
        detail: {
          at: '/users/victor/1.txt',
          updator,
          rollbacker: updator
        }
      });
    });
  });

  describe('rollbackJSONFile', () => {
    it("creates a new rollbackJSONFile instruction in the executor's instruction stack", () => {
      const context = new Context({ 'wd': '/users/victor', args: [], options: {}});
      const updator = (a: any) => a;

      context.rollbackJSONFile({
        at: '1.txt',
        updator,
        rollbacker: updator
      });
      expect(context.executor.instructions.length).toBe(1);
      expect(context.executor.instructions[0]).toEqual({
        type: 'rollbackJSONFile',
        detail: {
          at: '/users/victor/1.txt',
          updator,
          rollbacker: updator
        }
      });
    });
  });

  describe('installDependency', () => {
    it("creates a new installDependency instruction in the executor's instruction stack", () => {
      const context = new Context({ 'wd': '/users/victor', args: [], options: {}});

      context.installDependency({
        package: 'prevjs',
        version: '~2.0'
      });
      expect(context.executor.instructions.length).toBe(1);
      expect(context.executor.instructions[0]).toEqual({
        type: 'installDependency',
        detail: {
          package: 'prevjs',
          version: '~2.0',
          dev: undefined,
          mock: false
        }
      });
    });
    // TODO: test mockInstall just like overwrite for createFile
  });

  describe('removeDependency', () => {
    it("creates a new removeDependency instruction in the executor's instruction stack", () => {
      const context = new Context({ 'wd': '/users/victor', args: [], options: {}});

      context.removeDependency({
        package: 'prevjs'
      });
      expect(context.executor.instructions.length).toBe(1);
      expect(context.executor.instructions[0]).toEqual({
        type: 'removeDependency',
        detail: {
          package: 'prevjs',
          mock: undefined,
          version: undefined,
          dev: undefined
        }
      });
    });
    // TODO: test mockInstall just like overwrite for createFile
  });

});
