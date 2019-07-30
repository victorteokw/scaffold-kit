import * as path from 'path';
import * as fs from 'fs';
import deleteFile from '../../../src/handlers/deleteFile';

describe('instruction: delete file', () => {

  const dir = path.join(__dirname, 'example1');

  describe('when file is not exist', () => {
    const file = path.join(dir, 'not-exist');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };
    beforeAll(async () => {
      await deleteFile(
        { at: file },
        reporter
        );
    });
    afterAll(() => {
      fs.unlinkSync(file);
    });

    it('does nothing', () => {
      expect(fs.existsSync(file)).toBe(false);
    });

    it('sends create message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({
        message: 'not exist',
        file
      });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });

  describe("when file exists", () => {
    const file = path.join(dir, 'exist.txt');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };
    beforeAll(async () => {
      fs.writeFileSync(
        file,
        'abc\n'
      );
      await deleteFile({ at: file }, reporter);
    });
    afterAll(() => {
      fs.writeFileSync(
        file,
        'abc\n'
      );
    });

    it('deletes the file', () => {
      expect(fs.existsSync(file)).toBe(false);
    });

    it('sends delete message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({
        message: 'delete',
        file
      });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });

});
