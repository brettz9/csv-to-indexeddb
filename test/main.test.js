import {importCSVToIndexedDB} from '../dist/csv-to-indexeddb-es.js';

describe('Main tests', function () {
  it('API', function () {
    expect(importCSVToIndexedDB).to.be.a('function');
  });
});
