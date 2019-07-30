import * as path from 'path';
import * as fs from 'fs';
import updateJSONFile from '../../../src/handlers/updateJSONFile';
import ejsRenderer from '../../../src/renderers/ejsRenderer';
import silentReporter from '../../../src/reporters/silentReporter';

describe('instruction: update JSON file', () => {

  describe('when file is not exist', () => {

    it('create file', () => {

    });

    it('sends create message to reporter', () => {

    });
  });

  describe('when file exist and there are updates', () => {

    it('rewrite the file', () => {

    });

    it('sends update message to reporter', () => {

    });
  });

  describe('when file exist and content is up to date', () => {

    it('do nothing', () => {

    });

    it('sends up-to-date message to reporter', () => {

    });
  });

});
