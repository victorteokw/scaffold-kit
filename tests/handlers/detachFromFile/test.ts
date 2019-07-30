import * as path from 'path';
import * as fs from 'fs';
import detachFromFile from '../../../src/handlers/detachFromFile';
import ejsRenderer from '../../../src/renderers/ejsRenderer';
import silentReporter from '../../../src/reporters/silentReporter';

describe('instruction: detach from file', () => {

  describe('when file is not exist', () => {

    it('does nothing', () => {

    });

    it('sends not exist message to reporter', () => {

    });
  });

  describe('when file exist and content is not at the end', () => {

    it('does nothing', () => {

    });

    it('sends not detachable message to reporter', () => {

    });
  });

  describe('when file exist and content is at the end', () => {

    it('removes the content from the bottom', () => {

    });

    it('sends truncate message to reporter', () => {

    });
  });

  describe("reads content from `from'", () => {

    it('generates correct content', () => {

    });
  });

  describe("reads content from `content'", () => {

    it('generates correct content', () => {

    });
  });

  describe("renders template", () => {

    it('generates correct content', () => {

    });
  });
});
