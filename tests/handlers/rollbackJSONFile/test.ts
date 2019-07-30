import * as path from 'path';
import * as fs from 'fs';
import rollbackJSONFile from '../../../src/handlers/rollbackJSONFile';
import ejsRenderer from '../../../src/renderers/ejsRenderer';
import silentReporter from '../../../src/reporters/silentReporter';

describe('instruction: rollback JSON file', () => {

  describe('when file is not exist', () => {

    it('does nothing', () => {

    });

    it('sends not exist message to reporter', () => {

    });
  });

  describe('when file exist and there are updates', () => {

    it('rewrite the file', () => {

    });

    it('sends rollback message to reporter', () => {

    });
  });

  describe('when file exist and content is up to date', () => {

    it('do nothing', () => {

    });

    it('sends unchanged message to reporter', () => {

    });
  });

});
