/* eslint-disable jsdoc/check-types */
// Todo: Remove this disabling

import csv from 'csvtojson';

/**
 * @typedef {PlainObject} JsonInfo
 * @property {Array} fieldNames
 * @property {string} dbName, // 'myDb'
 * @property {string} storeName, // 'myRecords'
 * @property {string|Array} keyPath
 * @property {IDBFactory} [indexedDB] Instance of indexedDB to use;
 *   defaults to `window.indexedDB` or `global.indexedDB`
 * @property {Float} [dbVersion=undefined]
 * @property {Array} [indexes=[]]
 * @property {Array} [fieldSchemas=[]] E.g.,
 *   `{type: 'string'}, {type: 'integer'}`
 *   Can omit or pass null to default to average type in column
 */

// Todo: Add docs for other properties
/**
 * @param {JsonInfo} cfg
 * @param {JSON} cfg.json
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
} = {}) {
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
    req.addEventListener('blocked', (err) => {
      // eslint-disable-next-line no-console
      console.log('IndexedDB.open blocked', err);
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
 * @param {JsonInfo} cfg Config object
 * @param {string} [cfg.csvFilePath]
 * @param {string} [cfg.csvString]
 * @param {external:csvToJSONParserParameters} [cfg.parserParameters]
 * @returns {Promise<void>}
 */
async function importCSVToIndexedDB (cfg) {
  const {csvFilePath, csvString, parserParameters} = cfg;
  if (!csvFilePath && !csvString) {
    throw new TypeError('You must supply a `csvFilePath` or a `csvString`');
  }

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
