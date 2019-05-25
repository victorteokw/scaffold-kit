import * as path from 'path';
import * as fs from 'fs';
import appendFile from '../../../src/handlers/appendFile';
import ejsRenderer from '../../../src/renderers/ejsRenderer';
import silentReporter from '../../../src/reporters/silentReporter';

describe('instruction: append file', () => {

  const dir = path.join(__dirname, 'example1');

  describe('when file is not exist', () => {
    const file = path.join(dir, 'file1');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };
    beforeAll(async () => {
      await appendFile(
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

  describe('when file exist and content is not at the end', () => {
    const file = path.join(dir, 'text.txt');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };
    beforeAll(async () => {
      await appendFile(
        { content: 'this is line five\nthis is line six\n', at: file },
        reporter,
        ejsRenderer
        );
    });
    afterAll(() => {
      fs.writeFileSync(file, `this is line one
this is line two
this is line three
this is line four
`);
    });

    it('appends to existing file', () => {
      expect(fs.existsSync(file)).toBe(true)
      expect(fs.readFileSync(file).toString()).toBe(`this is line one
this is line two
this is line three
this is line four
this is line five
this is line six
`);
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

  describe('when file exist and content is already at the end', () => {
    const file = path.join(dir, 'text.txt');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };
    beforeAll(async () => {
      await appendFile(
        { content: 'this is line three\nthis is line four\n', at: file },
        reporter,
        ejsRenderer
        );
    });
    afterAll(() => {
      fs.writeFileSync(file, `this is line one
this is line two
this is line three
this is line four
`);
    });

    it('does not append to existing file', () => {
      expect(fs.existsSync(file)).toBe(true)
      expect(fs.readFileSync(file).toString()).toBe(`this is line one
this is line two
this is line three
this is line four
`);
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

  describe("reads content from `from'", () => {
    const at = path.join(dir, 'at.txt');
    const from = path.join(dir, 'from.txt');
    beforeAll(async () => {
      await appendFile(
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
    const at = path.join(dir, 'at');
    beforeAll(async () => {
      await appendFile(
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
    const at = path.join(dir, 'at');
    beforeAll(async () => {
      await appendFile(
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
