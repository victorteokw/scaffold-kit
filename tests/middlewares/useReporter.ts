import applyMiddleware from '../../src/applyMiddleware';
import Executable from '../../src/Executable';
import nullExecutable from '../../src/nullExecutable';
import useReporter from '../../src/middlewares/useReporter';
import silentReporter from '../../src/reporters/silentReporter';
import plainReporter from '../../src/reporters/plainReporter';
import Context from '../../src/Context';

describe("Changes context's reporter", () => {

  it("changes reporter", async () => {
    const context = new Context({
      wd: '/usr',
      args: [],
      options: {}
    });
    expect(context.reporter).toBe(plainReporter);
    await useReporter(silentReporter)(context, nullExecutable);
    expect(context.reporter).toBe(silentReporter);
  });

});
