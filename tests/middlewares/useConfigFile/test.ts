import * as path from 'path';
import Context from '../../../src/Context';
import applyMiddleware from '../../../src/applyMiddleware';
import useConfigFile from '../../../src/middlewares/useConfigFile';
import defineOptions from '../../../src/middlewares/defineOptions';
import parseArgv from '../../../src/middlewares/parseArgv';
import nullExecutable from '../../../src/nullExecutable';
import * as fs from 'fs';

describe('Uses config file', () => {

  afterEach(() => {
    // remove config for example 2
    const example2Config = path.join(__dirname, 'example2/.jokerrc.json');
    if (fs.existsSync(example2Config)) {
      fs.unlinkSync(example2Config);
    }
  });

  it('file not exist, no savable options, do nothing', async () => {
    const projDir = path.join(__dirname, 'example1');
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
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
  });

  it('file not exist, has savable options, but default val, do nothing',
  async () => {
    const projDir = path.join(__dirname, 'example1');
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
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
  });

  it('file not exist, new savable appear, create file and add record',
  async () => {
    const projDir = path.join(__dirname, 'example2');
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
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
  });

  it('file exist, no savable options, do nothing', async () => {
    const projDir = path.join(__dirname, 'example3');
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
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
  });

  it('file exist, has savable options, but default val, do nothing',
  async () => {
    const projDir = path.join(__dirname, 'example3');
    const context = new Context({
      wd: projDir,
      args: [],
      options: {}
    });
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
  });

  it('file exist, new savable appear, add config record', () => {

  });

  it('file exist, same savable different value, update config record', () => {

  });

  it('file exist, same savable but default appear, delete record', () => {

  });

  it('deletes rules used to be savable but now not', () => {

  });

  it("don't touch undefined rules", () => {

  });

});
