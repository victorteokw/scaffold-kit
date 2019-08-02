import * as path from 'path';
import * as fs from 'fs';
import updateJSONFile from '../../../src/handlers/updateJSONFile';

describe('instruction: update JSON file', () => {

  const dir = path.join(__dirname, 'example1');

  describe('when file is not exist', () => {
    const file = path.join(dir, 'not-exist.json');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };

    beforeAll(async () => {
      await updateJSONFile(
        {
          updator: content => content,
          rollbacker: content => content,
          at: file
        },
        reporter
      )
    });
    afterAll(() => {
      fs.unlinkSync(file);
    });

    it('create file', () => {
      expect(fs.existsSync(file)).toBe(true)
      expect(fs.readFileSync(file).toString()).toBe('{}\n')
    });

    it('sends create message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({
        message: 'create',
        file
      });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });

  describe('when file exist and there are updates', () => {
    const file = path.join(dir, 'exist-update.json');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };

    beforeAll(async () => {
      await updateJSONFile(
        {
          updator: () => ({ name: 'updateJSONFile' }),
          rollbacker: content => content,
          at: file
        },
        reporter
      )
    });
    afterAll(() => {
      fs.writeFileSync(file, '{}\n');
    });

    it('rewrite the file', () => {
      expect(fs.existsSync(file)).toBe(true)
      expect(fs.readFileSync(file).toString()).toBe(JSON.stringify({ name: 'updateJSONFile' }, null, 2) + '\n')
    });

    it('sends update message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({
        message: 'update',
        file
      });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });

  describe('when file exist and content is up to date', () => {
    const file = path.join(dir, 'exist-up-to-date.json');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };

    beforeAll(async () => {
      await updateJSONFile(
        {
          updator: () => ({ name: 'updateJSONFile' }),
          rollbacker: content => content,
          at: file
        },
        reporter
      )
    });
    afterAll(() => {
      fs.writeFileSync(file, JSON.stringify({ name: 'updateJSONFile' }, null, 2) + '\n');
    });

    it('do nothing', () => {
      expect(fs.existsSync(file)).toBe(true)
      expect(fs.readFileSync(file).toString()).toBe(JSON.stringify({ name: 'updateJSONFile' }, null, 2) + '\n')
    });

    it('sends up-to-date message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({
        message: 'up-to-date',
        file
      });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });

});
