import {importCSVToIndexedDB} from '../src/index.js';

describe('Main tests', function () {
  it('API', function () {
    expect(importCSVToIndexedDB).to.be.a('function');
  });
});
