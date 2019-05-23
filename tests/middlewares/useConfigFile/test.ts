import * as path from 'path';
import Context from '../../../src/Context';
import useConfigFile from '../../../src/middlewares/useConfigFile';
import nullExecutable from '../../../src/nullExecutable';

describe('Uses config file', () => {

  it('file not exist, no savable options, do nothing', () => {

  });

  it('file not exist, has savable options, but default val, do nothing', () => {

  });

  it('file exist, no savable options, do nothing', () => {

  });

  it('file exist, has savable options, but default val, do nothing', () => {

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
