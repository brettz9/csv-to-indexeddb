/* globals indexedDB, setGlobalVars,
  importCSVToIndexedDB, importJSONToIndexedDB,
  getSuccess, cleanupDatabases */

// esm having problems being used with nyc, so setting in environment instead
// import setGlobalVars from 'indexeddbshim/src/node-UnicodeIdentifiers.js';
// import {importCSVToIndexedDB, importJSONToIndexedDB} from '../src/index.js';

describe('Main tests', function () {
  beforeEach(() => {
    global.location = {origin: 'example.com'};
    setGlobalVars();
    indexedDB.deleteDatabase('testDb');
  });
  after(() => {
    cleanupDatabases();
  });

  it('API', function () {
    expect(importCSVToIndexedDB).to.be.a('function');
    expect(importJSONToIndexedDB).to.be.a('function');
    expect(indexedDB).to.be.an('IDBFactory');
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
});
