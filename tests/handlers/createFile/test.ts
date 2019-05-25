import * as path from 'path';
import * as fs from 'fs';
import createFile from '../../../src/handlers/createFile';
import ejsRenderer from '../../../src/renderers/ejsRenderer';
import silentReporter from '../../../src/reporters/silentReporter';

describe('instruction: create file', () => {

  const dir = path.join(__dirname, 'example1');

  describe('when file is not exist', () => {
    const file = path.join(dir, 'file1');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };
    beforeAll(async () => {
      await createFile(
        { content: 'childhood\n', at: file },
        reporter,
        ejsRenderer
        );
    });
    afterAll(() => {
      fs.unlinkSync(file);
    });

    it('creates a new file', () => {
      expect(fs.existsSync(file)).toBe(true)
      expect(fs.readFileSync(file).toString()).toBe('childhood\n');
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

  describe("when file exist and `overwrite' is false", () => {
    const file = path.join(dir, 'exist.txt');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };
    beforeAll(async () => {
      await createFile(
        {
          content: 'after tomorrow\n',
          at: file,
          overwrite: false
        },
        reporter,
        ejsRenderer
        );
    });
    afterAll(() => {
      fs.writeFileSync(
        file,
        'become the adult that we cannot understand step by step\n'
      );
    });

    it('does not modify the original file', () => {
      expect(fs.existsSync(file)).toBe(true)
      expect(fs.readFileSync(file).toString())
        .toBe('become the adult that we cannot understand step by step\n');
    });

    it('sends exist message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({
        message: 'exist',
        file
      });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });

  describe("when file exist and `overwrite' is true", () => {
    const file = path.join(dir, 'ow.txt');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };
    beforeAll(async () => {
      await createFile(
        {
          content: 'the shadow\n',
          at: file,
          overwrite: true
        },
        reporter,
        ejsRenderer
        );
    });
    afterAll(() => {
      fs.writeFileSync(file, `the smile\n`);
    });

    it('overwrites the existing file', () => {
      expect(fs.existsSync(file)).toBe(true)
      expect(fs.readFileSync(file).toString()).toBe('the shadow\n');
    });

    it('sends up-to-date message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({
        message: 'overwrite',
        file
      });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });

  describe("reads content from `from'", () => {
    const from = path.join(dir, 'from.txt');
    const at = path.join(dir, 'at.txt');
    beforeAll(async () => {
      await createFile(
        { from, at, context: { time: 'childhood' }},
        silentReporter,
        ejsRenderer
        );
    });
    afterAll(() => {
      fs.unlinkSync(at);
    });

    it('generates correct content', () => {
      expect(fs.existsSync(at)).toBe(true)
      expect(fs.readFileSync(at).toString()).toBe(
        'The sky of childhood is compressing.\n'
      );
    });
  });

  describe("reads content from `content'", () => {
    const content =
      'sometimes in the deep night, dreams <%= who %> at that time.\n';
    const at = path.join(dir, 'to.txt');
    beforeAll(async () => {
      await createFile(
        { content, at, context: { who: 'myself' }},
        silentReporter,
        ejsRenderer
        );
    });
    afterAll(() => {
      fs.unlinkSync(at);
    });

    it('generates correct content', () => {
      expect(fs.existsSync(at)).toBe(true)
      expect(fs.readFileSync(at).toString()).toBe(
        'sometimes in the deep night, dreams myself at that time.\n'
      );
    });
  });

  describe("renders template", () => {
    const content =
      'sometimes in the deep night, dreams <%= who %> at that time.\n';
    const at = path.join(dir, 'to.txt');
    beforeAll(async () => {
      await createFile(
        { content, at, context: { who: 'myself' }},
        silentReporter,
        ejsRenderer
        );
    });
    afterAll(() => {
      fs.unlinkSync(at);
    });

    it('generates correct content', () => {
      expect(fs.existsSync(at)).toBe(true)
      expect(fs.readFileSync(at).toString()).toBe(
        'sometimes in the deep night, dreams myself at that time.\n'
      );
    });
  });
});
