/* eslint-disable jsdoc/check-types */
// Todo: Remove this disabling

import csv from 'csvtojson';

// Todo: Add docs for other properties
/**
 * @param {PlainObject} cfg
 * @param {Array} cfg.fieldNames
 * @param {Array} [cfg.fieldSchemas=[]] E.g.,
 *   `{type: 'string'}, {type: 'integer'}`
 *   Can omit or pass null to default to average type in column
 * @param {string} cfg.dbName, // 'myDb'
 * @param {string} cfg.storeName, // 'myRecords'
 * @param {Array} [cfg.indexes=[]]
 * @param {string|Array} cfg.keyPath
 * @param {IDBFactory} [cfg.indexedDB] Instance of indexedDB to use; defaults to
 *   `window.indexedDB` or `global.indexedDB`
 * @returns {Promise<void>}
*/
function importJSONToIndexedDB ({
  // eslint-disable-next-line no-shadow
  indexedDB = typeof window !== 'undefined'
    ? window.indexedDB
    : typeof global !== 'undefined'
      ? global.indexedDB
      : null,
  json,
  fieldNames = [],
  // Can omit or pass null to default to average type in column
  fieldSchemas = [], // {type: 'string'}, {type: 'integer'}
  dbName, // 'myDb'
  dbVersion = undefined,
  storeName, // 'myRecords'
  indexes = [],
  keyPath // '', [], etc
}) {
  if (!indexedDB) {
    throw new TypeError('A valid instance of `indexedDB` is required.');
  }
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    /* eslint-disable promise/prefer-await-to-callbacks */
    const req = indexedDB.open(dbName, dbVersion);
    req.addEventListener('upgradeneeded', () => {
      // Todo

    });
    req.addEventListener('success', () => {
      // Todo

    });
    req.addEventListener('error', (err) => {
      // eslint-disable-next-line no-console
      console.log('IndexedDB.open error', err);
    });
    /* eslint-enable promise/prefer-await-to-callbacks */
  });
}

/**
* @external csvToJSONParserParameters
* @see https://www.npmjs.com/package/csvtojson#user-content-parameters
*/

/**
 *
 * @param {PlainObject} cfg Config object
 * @param {string} [cfg.csvFilePath]
 * @param {string} [cfg.csvString]
 * @param {external:csvToJSONParserParameters} [cfg.parserParameters]
 * @param {Array} cfg.fieldNames
 * @param {Array} [cfg.fieldSchemas=[]] E.g.,
 *   `{type: 'string'}, {type: 'integer'}`
 *   Can omit or pass null to default to average type in column
 * @param {string} cfg.dbName, // 'myDb'
 * @param {string} cfg.storeName, // 'myRecords'
 * @param {Array} [cfg.indexes=[]]
 * @param {string|Array} cfg.keyPath
 * @param {IDBFactory} [cfg.indexedDB] Instance of indexedDB to use; defaults to
 *   `window.indexedDB` or `global.indexedDB`
 * @returns {Promise<void>}
 */
async function importCSVToIndexedDB (cfg) {
  const {csvFilePath, csvString, parserParameters} = cfg;

  const json = csvFilePath
    ? await csv({
      ...parserParameters, output: 'json'
    }).fromFile(csvFilePath)
    /**
     * [
     *   {a:"1", b:"2", c:"3"},
     *   {a:"4", b:"5". c:"6"}
     * ]
     */
    : await csv({
      ...parserParameters, output: 'csv'
    }).fromString(csvString);

  return importJSONToIndexedDB({...cfg, json});
}

export {
  importJSONToIndexedDB,
  importCSVToIndexedDB
};
