import Context from '../src/Context';

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

      });

      it('has default value that user passed in', () => {

      });
    });

    describe('has field args', () => {
      it('can be set to array of string value and can be get', () => {

      });

      it('has default value that user passed in', () => {

      });
    });

    describe('has field options', () => {
      it('can be set to Options value and can be get', () => {

      });

      it('has default value that user passed in', () => {

      });
    });
  });

  describe('has context option fields', () => {
    describe('has field overwrite', () => {
      it('can be set to boolean value and can be get', () => {

      });

      it('has default value false', () => {

      });
    });

    describe('has field mockInstall', () => {
      it('can be set to boolean value and can be get', () => {

      });

      it('has default value false', () => {

      });
    });
  });

  describe('has execution behavior fields', () => {
    describe('has field disableFlush', () => {
      it('can be set to boolean value and can be get', () => {

      });

      it('has default value false', () => {

      });
    });
    describe('has field reporter', () => {
      it('can be set to Reporter value and can be get', () => {

      });

      it('has default value plainReporter', () => {

      });
    });
    describe('has field executor', () => {
      it('is readonly', () => {

      });
      it("on creation, it's a brand new executor", () => {

      });
    });
  });
});
