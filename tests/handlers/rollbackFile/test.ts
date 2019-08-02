import * as path from 'path';
import * as fs from 'fs';
import rollbackFile from '../../../src/handlers/rollbackFile';

describe('instruction: rollback file', () => {

  const dir = path.join(__dirname, 'example1');

  describe('when file is not exist', () => {
    const file = path.join(dir, 'not-exist');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };

    beforeAll(async () => {
      await rollbackFile(
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

  describe('when file exist and there are rollback', () => {
    const file = path.join(dir, 'exist-rollback.txt');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };

    beforeAll(async () => {
      await rollbackFile(
        {
          updator: content => content,
          rollbacker: () => 'this is the rollback text',
          at: file
        },
        reporter
      )
    });
    afterAll(() => {
      fs.writeFileSync(file, '');
    });

    it('rewrite the file', () => {
      expect(fs.existsSync(file)).toBe(true)
      expect(fs.readFileSync(file).toString()).toBe('this is the rollback text')
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

  describe('when file exist and content is unchanged', () => {
    const file = path.join(dir, 'exist-unchanged.txt');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };

    beforeAll(async () => {
      await rollbackFile(
        {
          updator: () => 'this is the unchanged text',
          rollbacker: content => content,
          at: file
        },
        reporter
      )
    });
    afterAll(() => {
      fs.writeFileSync(file, 'this is the unchanged text');
    });

    it('do nothing', () => {
      expect(fs.existsSync(file)).toBe(true)
      expect(fs.readFileSync(file).toString()).toBe('this is the unchanged text')
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
