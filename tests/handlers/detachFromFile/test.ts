import * as path from 'path';
import * as fs from 'fs';
import detachFromFile from '../../../src/handlers/detachFromFile';
import ejsRenderer from '../../../src/renderers/ejsRenderer';
import silentReporter from '../../../src/reporters/silentReporter';

describe('instruction: detach from file', () => {

  const dir = path.join(__dirname, 'example1');

  describe('when file is not exist', () => {
    const file = path.join(dir, 'not-exist.txt');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };

    beforeAll(async () => {
      await detachFromFile(
        { content: 'useContext Hook', at: file },
        reporter,
        ejsRenderer
      )
    });

    it('does nothing', () => {
      expect(fs.existsSync(file)).toBe(false);
    });

    it('sends not exist message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({ message: 'not exist', file });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });

  describe('when file exist and content is not at the end', () => {
    const file = path.join(dir, 'exist-not-detachable.txt');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };

    beforeAll(async () => {
      await detachFromFile(
        { content: 'useContext Hook', at: file },
        reporter,
        ejsRenderer
      )
    });
    afterAll(() => {
      fs.writeFileSync(file, 'Take the world as it is.\n');
    });

    it('does nothing', () => {
      expect(fs.existsSync(file)).toBe(true)
      expect(fs.readFileSync(file).toString()).toBe('Take the world as it is.\n')
    });

    it('sends not detachable message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({ message: 'not detachable', file });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });

  describe('when file exist and content is at the end', () => {
    const file = path.join(dir, 'exist-truncate.txt');
    const reporter = {
      push: jest.fn(),
      flush: jest.fn()
    };

    beforeAll(async () => {
      await detachFromFile(
        {
          content: 'context.\n',
          at: file
        },
        reporter,
        ejsRenderer
      )
    });
    afterAll(() => {
      fs.writeFileSync(file, 'component composition is often a simpler solution than context.\n');
    });

    it('removes the content from the bottom', () => {
      expect(fs.existsSync(file)).toBe(true)
      expect(fs.readFileSync(file).toString()).toBe('component composition is often a simpler solution than ')
    });

    it('sends truncate message to reporter', () => {
      expect(reporter.push.mock.calls.length).toBe(1);
      expect(reporter.push.mock.calls[0][0]).toEqual({ message: 'truncate', file });
      expect(reporter.flush.mock.calls.length).toBe(0);
    });
  });

  describe("reads content from `from'", () => {
    const at = path.join(dir, 'at.txt');
    const from = path.join(dir, 'from.txt');

    beforeAll(async () => {
      await detachFromFile(
        { from, at, context: { name: 'Jason Statham' } },
        silentReporter,
        ejsRenderer
      )
    });
    afterAll(() => {
      fs.writeFileSync(at, 'Some people say that looking back pain past is pleasure.\n');
    });

    it('generates correct content', () => {
      expect(fs.existsSync(at)).toBe(true);
      expect(fs.readFileSync(at).toString()).toBe('Some people say that looking back ');
    });

  });

  describe("reads content from `content'", () => {
    const content = 'pain past is <%= feel %>.\n';
    const at = path.join(dir, 'at.txt');

    beforeAll(async () => {
      await detachFromFile(
        { content, at, context: { feel: 'pleasure' } },
        silentReporter,
        ejsRenderer
      )
    });
    afterAll(() => {
      fs.writeFileSync(at, 'Some people say that looking back pain past is pleasure.\n');
    });

    it('generates correct content', () => {
      expect(fs.existsSync(at)).toBe(true);
      expect(fs.readFileSync(at).toString()).toBe('Some people say that looking back ');
    });

  });

  describe("renders template", () => {
    const content = 'pain past is <%= feel %>.\n';
    const at = path.join(dir, 'at.txt');

    beforeAll(async () => {
      await detachFromFile(
        { content, at, context: { feel: 'pleasure' } },
        silentReporter,
        ejsRenderer
      )
    });
    afterAll(() => {
      fs.writeFileSync(at, 'Some people say that looking back pain past is pleasure.\n');
    });

    it('generates correct content', () => {
      expect(fs.existsSync(at)).toBe(true);
      expect(fs.readFileSync(at).toString()).toBe('Some people say that looking back ');
    });

  });

});
