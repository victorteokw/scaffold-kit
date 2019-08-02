import * as path from 'path';
import * as fs from 'fs';
import rollbackJSONFile from '../../../src/handlers/rollbackJSONFile';

describe('instruction: rollback JSON file', () => {

  const dir = path.join(__dirname, 'example1');

  describe('when file is not exist', () => {
    const file = path.join(dir, 'not-exist.json');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };

    beforeAll(async () => {
      await rollbackJSONFile(
        {
          updator: content => content,
          rollbacker: content => content,
          at: file
        },
        reporter
      )
    });

    it('does nothing', () => {
      expect(fs.existsSync(file)).toBe(false)
    });

    it('sends not exist message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({
        message: 'not exist',
        file
      });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });

  describe('when file exist and there are updates', () => {
    const file = path.join(dir, 'exist-rollback.json');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };

    beforeAll(async () => {
      await rollbackJSONFile(
        {
          updator: content => content,
          rollbacker: () => ({ name: 'rollbackJSONFile' }),
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
      expect(fs.readFileSync(file).toString()).toBe(JSON.stringify({ name: 'rollbackJSONFile' }, null, 2) + '\n')
    });

    it('sends rollback message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({
        message: 'rollback',
        file
      });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });

  describe('when file exist and content is up to date', () => {
    const file = path.join(dir, 'exist-unchanged.json');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };

    beforeAll(async () => {
      await rollbackJSONFile(
        {
          updator: content => content,
          rollbacker: () => ({ name: 'rollbackJSONFile' }),
          at: file
        },
        reporter
      )
    });
    afterAll(() => {
      fs.writeFileSync(file, JSON.stringify({ name: 'rollbackJSONFile' }, null, 2) + '\n');
    });

    it('do nothing', () => {
      expect(fs.existsSync(file)).toBe(true)
      expect(fs.readFileSync(file).toString()).toBe(JSON.stringify({ name: 'rollbackJSONFile' }, null, 2) + '\n')
    });

    it('sends unchanged message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({
        message: 'unchanged',
        file
      });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });

});
