/* globals indexedDB,
  importCSVToIndexedDB, importJSONToIndexedDB,
  getSuccess, cleanupDatabases */

// esm having problems being used with nyc, so setting in environment instead
// import setGlobalVars from 'indexeddbshim/src/node-UnicodeIdentifiers.js';
// import {importCSVToIndexedDB, importJSONToIndexedDB} from '../src/index.js';

describe('Main tests', function () {
  it('API', function () {
    expect(importCSVToIndexedDB).to.be.a('function');
    expect(importJSONToIndexedDB).to.be.a('function');
    expect(indexedDB).to.be.an('IDBFactory');
  });

  describe('importJSONToIndexedDB', function () {
    this.timeout(5000);

    beforeEach(() => {
      // eslint-disable-next-line promise/avoid-new
      return new Promise((resolve, reject) => {
        const req = indexedDB.deleteDatabase('testDb');
        req.addEventListener('success', () => {
          cleanupDatabases();
          resolve();
        });
      });
    });
    after(() => {
      cleanupDatabases();
    });

    it('importJSONToIndexedDB', async function () {
      const {target: {result: db}} = await importJSONToIndexedDB({
        json: [
          {a: '1', b: '2', c: '3'},
          {a: '4', b: '5', c: '6'}
        ],
        dbName: 'testDb',
        storeName: 'myRecords',
        keyPath: 'b'
      });
      expect(db).to.be.an('IDBDatabase');

      const tx = db.transaction('myRecords', 'readonly');
      const store = tx.objectStore('myRecords');
      const req = store.get('5');

      await getSuccess(req, (result) => {
        expect(result).to.deep.equal({
          a: '4', b: '5', c: '6'
        });
      });
    });

    it('importJSONToIndexedDB (with indexes)', async function () {
      const {target: {result: db}} = await importJSONToIndexedDB({
        json: [
          {a: '1', b: '2', c: '3'},
          {a: '4', b: '5', c: '6'}
        ],
        dbName: 'testDb',
        storeName: 'myRecords',
        keyPath: 'b',
        indexes: [
          {
            name: 'letterA',
            keyPath: 'a'
          }
        ]
      });
      expect(db).to.be.an('IDBDatabase');

      const tx = db.transaction('myRecords', 'readonly');
      const store = tx.objectStore('myRecords');
      const index = store.index('letterA');

      const req = index.get('1');

      await getSuccess(req, (result) => {
        expect(result).to.deep.equal({
          a: '1', b: '2', c: '3'
        });
      });
    });
  });
});
