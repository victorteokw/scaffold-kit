import * as path from 'path';
import Context from '../../../src/Context';
import applyMiddleware from '../../../src/applyMiddleware';
import useConfigFile from '../../../src/middlewares/useConfigFile';
import defineOptions from '../../../src/middlewares/defineOptions';
import parseArgv from '../../../src/middlewares/parseArgv';
import nullExecutable from '../../../src/nullExecutable';
import * as fs from 'fs';
import Reporter from '../../../src/Reporter';
import * as CSON from 'cson-parser';
import * as YAML from 'js-yaml';

describe('Uses config file', () => {

  afterEach(() => {
    // remove config for example 2
    const example2Config = path.join(__dirname, 'example2/.jokerrc.json');
    if (fs.existsSync(example2Config)) {
      fs.unlinkSync(example2Config);
    }
    // rollback config for example 4
    const example4Config = path.join(__dirname, 'example4/.jokerrc.json');
    fs.writeFileSync(example4Config, JSON.stringify({
      key1: 'val1',
      key2: 'val2'
    }, null, 2));
    // rollback config for example 5
    const example5Config = path.join(__dirname, 'example5/.jokerrc.json');
    fs.writeFileSync(example5Config, JSON.stringify({
      key1: 'val1',
      key2: 'val2',
      orm: 'was'
    }, null, 2));
    // rollback config for example 6
    const example6Config = path.join(__dirname, 'example6/.jokerrc.json');
    fs.writeFileSync(example6Config, JSON.stringify({
      key1: 'val1',
      key2: 'val2',
      orm: 'was'
    }, null, 2));
    // rollback config for example 7
    const example7Config = path.join(__dirname, 'example7/.jokerrc.json');
    fs.writeFileSync(example7Config, JSON.stringify({
      lang: 'ts',
      orm: 'mongoose'
    }, null, 2));
    // rollback config for example 8
    const example8Config = path.join(__dirname, 'example8/.jokerrc.cson');
    fs.writeFileSync(example8Config, CSON.stringify({
      lang: 'ts',
      orm: 'mongoose'
    }, null, 2));
    // rollback config for example 9
    const example9Config = path.join(__dirname, 'example9/.jokerrc.yaml');
    fs.writeFileSync(example9Config, YAML.dump({
      lang: 'ts',
      orm: 'mongoose'
    }));
  });

  it('file not exist, no savable options, do nothing', async () => {
    const projDir = path.join(__dirname, 'example1');
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
    const push = jest.fn();
    const flush = jest.fn();
    const reporter: Reporter = { flush, push };
    context.reporter = reporter;
    process.argv = ['model', 'User', 'name:String', '--orm=typeorm'];
    const executable = applyMiddleware(
      useConfigFile('.jokerrc.json'),
      defineOptions({
        orm: {
          type: 'string',
          desc: 'the orm to be used.'
        }
      }),
      parseArgv
    );
    await executable(context, nullExecutable);
    const fileList = fs.readdirSync(projDir);
    expect(fileList).toEqual(['.keep']);
    expect(push.mock.calls.length).toBe(0);
    expect(flush.mock.calls.length).toBe(0);
  });

  it('file not exist, has savable options, but default val, do nothing',
  async () => {
    const projDir = path.join(__dirname, 'example1');
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
    const push = jest.fn();
    const flush = jest.fn();
    const reporter: Reporter = { flush, push };
    context.reporter = reporter;
    process.argv = ['model', 'User', 'name:String', '--orm=typeorm'];
    const executable = applyMiddleware(
      useConfigFile('.jokerrc'),
      defineOptions({
        orm: {
          type: 'string',
          desc: 'the orm to be used.',
          default: 'typeorm',
          save: true
        }
      }),
      parseArgv
    );
    await executable(context, nullExecutable);
    const fileList = fs.readdirSync(projDir);
    expect(fileList).toEqual(['.keep']);
    expect(push.mock.calls.length).toBe(0);
    expect(flush.mock.calls.length).toBe(0);
  });

  it('file not exist, new savable appear, create file and add record',
  async () => {
    const projDir = path.join(__dirname, 'example2');
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
    const push = jest.fn();
    const flush = jest.fn();
    const reporter: Reporter = { flush, push };
    context.reporter = reporter;
    process.argv = ['model', 'User', 'name:String', '--orm=mongoose'];
    const executable = applyMiddleware(
      useConfigFile('.jokerrc'),
      defineOptions({
        orm: {
          type: 'string',
          desc: 'the orm to be used.',
          default: 'typeorm',
          save: true
        }
      }),
      parseArgv
    );
    await executable(context, nullExecutable);
    const fileList = fs.readdirSync(projDir);
    expect(fileList).toHaveLength(2);
    expect(fileList).toContain('.keep');
    expect(fileList).toContain('.jokerrc.json');
    const content = JSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.json')
    ).toString());
    expect(content).toEqual({ orm: 'mongoose' });
    expect(push.mock.calls.length).toBe(1);
    expect(push.mock.calls[0][0]).toEqual({
      message: 'add',
      config: '"orm": "mongoose"'
    });
    expect(flush.mock.calls.length).toBe(0);
  });

  it('file exist, no savable options, do nothing', async () => {
    const projDir = path.join(__dirname, 'example3');
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
    const push = jest.fn();
    const flush = jest.fn();
    const reporter: Reporter = { flush, push };
    context.reporter = reporter;
    process.argv = ['model', 'User', 'name:String', '--orm=mongoose'];
    const executable = applyMiddleware(
      useConfigFile('.jokerrc'),
      defineOptions({
        orm: {
          type: 'string',
          desc: 'the orm to be used.',
          default: 'typeorm'
        }
      }),
      parseArgv
    );
    await executable(context, nullExecutable);
    const fileList = fs.readdirSync(projDir);
    expect(fileList).toHaveLength(1);
    expect(fileList).toContain('.jokerrc.json');
    const content = JSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.json')
    ).toString());
    expect(content).toEqual({ key1: 'value1', key2: 'value2' });
    expect(push.mock.calls.length).toBe(0);
    expect(flush.mock.calls.length).toBe(0);
  });

  it('file exist, has savable options, but default val, do nothing',
  async () => {
    const projDir = path.join(__dirname, 'example3');
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
    const push = jest.fn();
    const flush = jest.fn();
    const reporter: Reporter = { flush, push };
    context.reporter = reporter;
    process.argv = ['model', 'User', 'name:String', '--orm=mongoose'];
    const executable = applyMiddleware(
      useConfigFile('.jokerrc'),
      defineOptions({
        orm: {
          type: 'string',
          desc: 'the orm to be used.',
          default: 'mongoose',
          save: true
        }
      }),
      parseArgv
    );
    await executable(context, nullExecutable);
    const fileList = fs.readdirSync(projDir);
    expect(fileList).toHaveLength(1);
    expect(fileList).toContain('.jokerrc.json');
    const content = JSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.json')
    ).toString());
    expect(content).toEqual({ key1: 'value1', key2: 'value2' });
    expect(push.mock.calls.length).toBe(0);
    expect(flush.mock.calls.length).toBe(0);
  });

  it('file exist, new savable appear, add config record', async () => {
    const projDir = path.join(__dirname, 'example4');
    let content = JSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.json')
    ).toString());
    expect(content).toEqual({ key1: 'val1', key2: 'val2' });
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
    const push = jest.fn();
    const flush = jest.fn();
    const reporter: Reporter = { flush, push };
    context.reporter = reporter;
    process.argv = ['model', 'User', 'name:String', '--orm=mongoose'];
    const executable = applyMiddleware(
      useConfigFile('.jokerrc'),
      defineOptions({
        orm: {
          type: 'string',
          desc: 'the orm to be used.',
          default: 'typeorm',
          save: true
        }
      }),
      parseArgv
    );
    await executable(context, nullExecutable);
    const fileList = fs.readdirSync(projDir);
    expect(fileList).toHaveLength(1);
    expect(fileList).toContain('.jokerrc.json');
    content = JSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.json')
    ).toString());
    expect(content).toEqual({ key1: 'val1', key2: 'val2', orm: 'mongoose' });
    expect(push.mock.calls.length).toBe(1);
    expect(push.mock.calls[0][0]).toEqual({
      message: 'add',
      config: '"orm": "mongoose"'
    });
    expect(flush.mock.calls.length).toBe(0);
  });

  it('file exist, same savable different value, update config record',
  async () => {
    const projDir = path.join(__dirname, 'example5');
    let content = JSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.json')
    ).toString());
    expect(content).toEqual({ key1: 'val1', key2: 'val2', orm: 'was' });
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
    const push = jest.fn();
    const flush = jest.fn();
    const reporter: Reporter = { flush, push };
    context.reporter = reporter;
    process.argv = ['model', 'User', 'name:String', '--orm=mongoose'];
    const executable = applyMiddleware(
      useConfigFile('.jokerrc'),
      defineOptions({
        orm: {
          type: 'string',
          desc: 'the orm to be used.',
          default: 'typeorm',
          save: true
        }
      }),
      parseArgv
    );
    await executable(context, nullExecutable);
    const fileList = fs.readdirSync(projDir);
    expect(fileList).toHaveLength(1);
    expect(fileList).toContain('.jokerrc.json');
    content = JSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.json')
    ).toString());
    expect(content).toEqual({ key1: 'val1', key2: 'val2', orm: 'mongoose' });
    expect(push.mock.calls.length).toBe(1);
    expect(push.mock.calls[0][0]).toEqual({
      message: 'update',
      config: '"orm": "mongoose"'
    });
    expect(flush.mock.calls.length).toBe(0);
  });

  it('file exist, same savable but default appear, delete record', async () => {
    const projDir = path.join(__dirname, 'example6');
    let content = JSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.json')
    ).toString());
    expect(content).toEqual({ key1: 'val1', key2: 'val2', orm: 'was' });
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
    const push = jest.fn();
    const flush = jest.fn();
    const reporter: Reporter = { flush, push };
    context.reporter = reporter;
    process.argv = ['model', 'User', 'name:String', '--orm=typeorm'];
    const executable = applyMiddleware(
      useConfigFile('.jokerrc'),
      defineOptions({
        orm: {
          type: 'string',
          desc: 'the orm to be used.',
          default: 'typeorm',
          save: true
        }
      }),
      parseArgv
    );
    await executable(context, nullExecutable);
    const fileList = fs.readdirSync(projDir);
    expect(fileList).toHaveLength(1);
    expect(fileList).toContain('.jokerrc.json');
    content = JSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.json')
    ).toString());
    expect(content).toEqual({ key1: 'val1', key2: 'val2' });
    expect(push.mock.calls.length).toBe(1);
    expect(push.mock.calls[0][0]).toEqual({
      message: 'delete',
      config: '"orm": "was"'
    });
    expect(flush.mock.calls.length).toBe(0);
  });

  it('deletes rules used to be savable but now not', async () => {
    const projDir = path.join(__dirname, 'example7');
    let content = JSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.json')
    ).toString());
    expect(content).toEqual({ lang: 'ts', orm: 'mongoose' });
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
    const push = jest.fn();
    const flush = jest.fn();
    const reporter: Reporter = { flush, push };
    context.reporter = reporter;
    process.argv = ['model', 'User', 'name:String', '--orm=typeorm'];
    const executable = applyMiddleware(
      useConfigFile('.jokerrc'),
      defineOptions({
        orm: {
          type: 'string',
          desc: 'the orm to be used.',
          default: 'typeorm',
          save: true
        },
        useModel: {
          type: 'boolean',
          desc: 'whether use ORM.',
          default: true,
          save: true
        }
      }),
      parseArgv
    );
    await executable(context, nullExecutable);
    const fileList = fs.readdirSync(projDir);
    expect(fileList).toHaveLength(1);
    expect(fileList).toContain('.jokerrc.json');
    content = JSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.json')
    ).toString());
    expect(content).toEqual({ lang: 'ts' });
    expect(push.mock.calls.length).toBe(1);
    expect(push.mock.calls[0][0]).toEqual({
      message: 'delete',
      config: '"orm": "mongoose"'
    });
    expect(flush.mock.calls.length).toBe(0);
  });

  it("don't touch undefined rules", async () => {
    const projDir = path.join(__dirname, 'example7');
    let content = JSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.json')
    ).toString());
    expect(content).toEqual({ lang: 'ts', orm: 'mongoose' });
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
    const push = jest.fn();
    const flush = jest.fn();
    const reporter: Reporter = { flush, push };
    context.reporter = reporter;
    process.argv = ['model', 'User', 'name:String', '--orm=typeorm'];
    const executable = applyMiddleware(
      useConfigFile('.jokerrc'),
      defineOptions({
        orm: {
          type: 'string',
          desc: 'the orm to be used.',
          default: 'typeorm',
          save: true
        },
        useModel: {
          type: 'boolean',
          desc: 'whether use ORM.',
          default: true,
          save: true
        }
      }),
      parseArgv
    );
    await executable(context, nullExecutable);
    const fileList = fs.readdirSync(projDir);
    expect(fileList).toHaveLength(1);
    expect(fileList).toContain('.jokerrc.json');
    content = JSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.json')
    ).toString());
    expect(content).toEqual({ lang: 'ts' });
    expect(push.mock.calls.length).toBe(1);
    expect(push.mock.calls[0][0]).toEqual({
      message: 'delete',
      config: '"orm": "mongoose"'
    });
    expect(flush.mock.calls.length).toBe(0);
  });

  it('supports cson format', async () => {
    const projDir = path.join(__dirname, 'example8');
    let content = CSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.cson')
    ).toString());
    expect(content).toEqual({ lang: 'ts', orm: 'mongoose' });
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
    const push = jest.fn();
    const flush = jest.fn();
    const reporter: Reporter = { flush, push };
    context.reporter = reporter;
    process.argv = ['model', 'User', 'name:String', '--orm=typeorm'];
    const executable = applyMiddleware(
      useConfigFile('.jokerrc'),
      defineOptions({
        orm: {
          type: 'string',
          desc: 'the orm to be used.',
          default: 'typeorm',
          save: true
        },
        useModel: {
          type: 'boolean',
          desc: 'whether use ORM.',
          default: true,
          save: true
        }
      }),
      parseArgv
    );
    await executable(context, nullExecutable);
    const fileList = fs.readdirSync(projDir);
    expect(fileList).toHaveLength(1);
    expect(fileList).toContain('.jokerrc.cson');
    content = CSON.parse(
      fs.readFileSync(path.join(projDir, '.jokerrc.cson')
    ).toString());
    expect(content).toEqual({ lang: 'ts' });
    expect(push.mock.calls.length).toBe(1);
    expect(push.mock.calls[0][0]).toEqual({
      message: 'delete',
      config: '"orm": "mongoose"'
    });
    expect(flush.mock.calls.length).toBe(0);
  });

  it('supports yaml format', async () => {
    const projDir = path.join(__dirname, 'example9');
    let content = YAML.load(
      fs.readFileSync(path.join(projDir, '.jokerrc.yaml')
    ).toString());
    expect(content).toEqual({ lang: 'ts', orm: 'mongoose' });
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
    const push = jest.fn();
    const flush = jest.fn();
    const reporter: Reporter = { flush, push };
    context.reporter = reporter;
    process.argv = ['model', 'User', 'name:String', '--orm=typeorm'];
    const executable = applyMiddleware(
      useConfigFile('.jokerrc'),
      defineOptions({
        orm: {
          type: 'string',
          desc: 'the orm to be used.',
          default: 'typeorm',
          save: true
        },
        useModel: {
          type: 'boolean',
          desc: 'whether use ORM.',
          default: true,
          save: true
        }
      }),
      parseArgv
    );
    await executable(context, nullExecutable);
    const fileList = fs.readdirSync(projDir);
    expect(fileList).toHaveLength(1);
    expect(fileList).toContain('.jokerrc.yaml');
    content = YAML.load(
      fs.readFileSync(path.join(projDir, '.jokerrc.yaml')
    ).toString());
    expect(content).toEqual({ lang: 'ts' });
    expect(push.mock.calls.length).toBe(1);
    expect(push.mock.calls[0][0]).toEqual({
      message: 'delete',
      config: '"orm": "mongoose"'
    });
    expect(flush.mock.calls.length).toBe(0);
  });

});
