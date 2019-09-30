import csv from 'csvtojson';

/**
* @callback UpgradeneededCallback
* @param {Event} e
*/

/**
* @typedef {string|string[]} KeyPath
*/

/**
* @typedef {PlainObject} IndexObject
* @property {string} name
* @property {KeyPath} keyPath
* @property {boolean} [unique=false]
* @property {boolean} [multiEntry=false]
*/

/**
 * @typedef {PlainObject} JsonInfo
 * @property {string} dbName, // 'myDb'
 * @property {string} storeName, // 'myRecords'
 * @property {KeyPath} keyPath
 * @property {boolean} [autoIncrement=true]
 * @property {IDBFactory} [indexedDB] Instance of indexedDB to use;
 *   defaults to `window.indexedDB` or `global.indexedDB`
 * @property {Float} [dbVersion=undefined]
 * @property {IndexObject[]} [indexes=[]]
 * @property {"csv"|"json"} [cfg.format="json"] When as an argument to
 *   `importCSVToIndexedDB`, this takes priority over any `output`
 *   on {@link external:csvToJSONParserParameters}
 *   (`cfg.parserParameters`); if neither set, defaults to `"json"`
 * @property {UpgradeneededCallback} upgradeneeded Use if you need to clean
 *   up the old version of the database, e.g., to remote indexes. Runs before
 *   the automated addition of indicated stores and indexes
 */

/**
 * @param {JsonInfo} cfg
 * @param {JSON} cfg.json
 * @returns {Promise<Event>} A success event or rejects with `Error` with
 *   an `$event` property set to `error` or `blocked`
*/
function importJSONToIndexedDB ({
  json,
  dbName, // 'myDb'
  storeName, // 'myRecords'
  keyPath, // '', [], etc
  autoIncrement = true,
  // eslint-disable-next-line no-shadow
  indexedDB = typeof window !== 'undefined'
    ? window.indexedDB
    : typeof global !== 'undefined'
      ? global.indexedDB
      : null,
  dbVersion = undefined,
  indexes = [],
  format = 'json',
  upgradeneeded = null
} = {}) {
  if (!indexedDB) {
    throw new TypeError('A valid instance of `indexedDB` is required.');
  }
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName, dbVersion);
    req.addEventListener('upgradeneeded', (e) => {
      const db = e.target.result;
      if (upgradeneeded) {
        upgradeneeded(db, e);
      }
      const store = db.createObjectStore(storeName, {
        keyPath,
        autoIncrement
      });
      indexes.forEach(({name, keyPath: kp, ...options}) => {
        db.createIndex(name, kp, options);
      });

      /**
       * For "csv":
       * [["1","2","3"], ["4","5","6"], ["7","8","9"]]
       *
       * For "json"
       * [
       *   {a:"1", b:"2", c:"3"},
       *   {a:"4", b:"5", c:"6"}
       * ]
       *
       * `flatKeys` vs. plain:
       * `a.b,a.c
       *   1,2`
       * `{"a.b":1,"a.c":2}` vs. `{"a":{"b":1,"c":2}}`
       */
      json.forEach((j) => {
        store.put(j);
      });
    });
    req.addEventListener('success', (e) => {
      resolve(e);
    });
    req.addEventListener('error', (e) => {
      // eslint-disable-next-line no-console
      console.log('IndexedDB.open error', e);
      const err = new Error('error');
      err.$event = e;
      reject(err);
    });
    req.addEventListener('blocked', (e) => {
      // eslint-disable-next-line no-console
      console.log('IndexedDB.open blocked', e);
      const err = new Error('error');
      err.$event = e;
      reject(err);
    });
  });
}

/**
 * While the `flatKeys` boolean property might otherwise seem to
 * be of interest, it is [not](https://w3c.github.io/IndexedDB/#key-path-construct)
 * [currently](https://github.com/w3c/IndexedDB/issues/209#issuecomment-536361712)
 * allowed as part of a keypath to give `{"a.b":1,"a.c":2}` rather than
 * `{"a":{"b":1,"c":2}}` with columns `a.b,a.c` and data `1,2`, and
 * use of periods in a keypath conveniently targets the nested
 * structure anyways, so it is most likely best to leave this with the
 * default of `false`.
 * @external csvToJSONParserParameters
 * @see https://www.npmjs.com/package/csvtojson#user-content-parameters
*/

/**
 * Instead of this callback, you may wish to alter the JSON as it is built
 * through [`cfg.parserParameters.colParser`]{@link https://github.com/Keyang/node-csvtojson#column-parser}.
 * Either may be necessary, particularly to get an array in the data, e.g., for
 * `multiEntry`-index-targeted properties (in which case a
 * [custom parser function]{@link https://github.com/Keyang/node-csvtojson#custom-parsers-function})
 * (or equivalent `AlterJSONCallback` transformation) would be needed. Note
 * that this callback operates on the whole array of JSON objects rather
 * than on just a single JSON object/CSV-JSON row.
 * @callback AlterJSONCallback
 * @param {JSON} json The input JSON
 * @returns {JSON} The manipulated JSON
*/

/**
 *
 * @param {JsonInfo} cfg Config object
 * @param {string} [cfg.csvFilePath]
 * @param {string} [cfg.csvString]
 * @param {string[]} [cfg.headers] Convenience for
 *   [`cfg.parserParameters.headers`]{@link https://www.npmjs.com/package/csvtojson#header-row}
 *   (this takes precedence); has no effect with "csv" format (i.e., array)
 * @param {boolean} [cfg.noheader=false] Convenience for
 *   [`cfg.parserParameters.noheader`]{@link https://www.npmjs.com/package/csvtojson#header-row}
 *   (this takes precedence)
 * @param {external:csvToJSONParserParameters} [cfg.parserParameters]
 * @param {AlterJSONCallback} [cfg.alterJSON]
 * @returns {Promise<Event>} A success event or rejects with `Error` with
 *   an `$event` property set to `error` or `blocked`
 */
async function importCSVToIndexedDB (cfg) {
  const {
    csvFilePath, csvString, parserParameters, alterJSON,
    format = parserParameters.output,
    headers = parserParameters.headers,
    noheader = parserParameters.noheader,
    ...remainingCfg
  } = cfg;

  if (!csvFilePath && !csvString) {
    throw new TypeError('You must supply a `csvFilePath` or a `csvString`');
  }

  let json = csvFilePath

    ? await csv({
      ...parserParameters, output: format, headers, noheader
    }).fromFile(csvFilePath)

    : await csv({
      ...parserParameters, output: format, headers, noheader
    }).fromString(csvString);

  if (alterJSON) {
    json = alterJSON(json);
  }

  return importJSONToIndexedDB({
    ...remainingCfg, json, format
  });
}

export {
  importJSONToIndexedDB,
  importCSVToIndexedDB
};
