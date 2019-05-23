import Context from '../../src/Context';
import parseArgv from '../../src/middlewares/parseArgv';
import nullExecutable from '../../src/nullExecutable';

describe('Parses ARGV', () => {

  it("parses process.argv according to ctx.optionDefinitions", async () => {
    process.argv = ['model', 'name:String', 'age:Int', '--use-graphql'];
    const ctx = new Context({
      wd: '/home/childhood',
      args: [],
      options: {}
    });
    ctx.optionDefinitions = {
      useGraphql: {
        default: false,
        type: 'boolean',
        desc: 'whether uses graphql.'
      }
    };
    await parseArgv(ctx, nullExecutable);
    expect(ctx.args).toEqual(['model', 'name:String', 'age:Int']);
    expect(ctx.options).toEqual({ useGraphql: true });
  });

  it('fully replaces old args and options', async () => {
    process.argv = [];
    const ctx = new Context({
      wd: '/home/childhood',
      args: ['a', 'b', 'c'],
      options: { save: true }
    });
    ctx.optionDefinitions = {
      useGraphql: {
        type: 'boolean',
        desc: 'whether uses graphql.'
      }
    };
    await parseArgv(ctx, nullExecutable);
    expect(ctx.args).toEqual([]);
    expect(ctx.options).toEqual({});
  });

});
