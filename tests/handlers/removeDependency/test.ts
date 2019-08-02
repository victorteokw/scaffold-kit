import * as path from 'path';
import * as fs from 'fs';
import removeDependency from '../../../src/handlers/removeDependency';

describe('instruction: remove dependency', () => {

  const dir1 = path.join(__dirname, 'example1');
  const dir2 = path.join(__dirname, 'example2');

  describe('when mock and not dev, update package.json', () => {
    const file = path.join(dir1, 'package.json');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };
    beforeAll(async () => {
      fs.writeFileSync(file, JSON.stringify({ dependencies: { 'bb8': '1.0.0' }, devDependencies: {}}));
      await removeDependency({
        wd: dir1,
        package: 'bb8',
        version: 'latest',
        mock: true,
        dev: false
      }, reporter);
    });
    afterAll(() => {
      fs.writeFileSync(file, JSON.stringify({ dependencies: { 'bb8': '1.0.0' }, devDependencies: {}}));
    });

    it('update package.json', () => {
      expect(JSON.parse(fs.readFileSync(file).toString())).toEqual({
        dependencies: {},
        devDependencies: {}
      });
    });

    it('sends create message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({
        message: 'remove',
        dependency: 'bb8'
      });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });

  describe('when mock and dev, update package.json', () => {
    const file = path.join(dir2, 'package.json');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };
    beforeAll(async () => {
      fs.writeFileSync(file, JSON.stringify({ dependencies: {}, devDependencies: { 'bb8': '1.0.0' }}));
      await removeDependency({
        wd: dir2,
        package: 'bb8',
        version: 'latest',
        mock: true,
        dev: true
      }, reporter);
    });
    afterAll(() => {
      fs.writeFileSync(file, JSON.stringify({ dependencies: {}, devDependencies: { 'bb8': '1.0.0' }}));
    });

    it('update package.json', () => {
      expect(JSON.parse(fs.readFileSync(file).toString())).toEqual({
        dependencies: {},
        devDependencies: {}
      });
    });

    it('sends create message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({
        message: 'remove',
        dependency: 'bb8'
      });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });
});
