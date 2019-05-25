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

});
