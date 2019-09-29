/* globals indexedDB */
import setGlobalVars from 'indexeddbshim/src/node-UnicodeIdentifiers.js';
import {importCSVToIndexedDB, importJSONToIndexedDB} from '../src/index.js';

describe('Main tests', function () {
  it('API', function () {
    setGlobalVars();
    expect(importCSVToIndexedDB).to.be.a('function');
    expect(importJSONToIndexedDB).to.be.a('function');
    expect(indexedDB).to.be.an('IDBFactory');
  });
});
