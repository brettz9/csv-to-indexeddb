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
 * @property {string[]|boolean} [fieldNames=[]] If true, it will treat the
 *   first row of `json` data as containing the field names
 * @property {IDBFactory} [indexedDB] Instance of indexedDB to use;
 *   defaults to `window.indexedDB` or `global.indexedDB`
 * @property {Float} [dbVersion=undefined]
 * @property {IndexObject[]} [indexes=[]]
 * @property {"csv"|"json"} [cfg.output="json"] When as an argument to
 *   `importCSVToIndexedDB`, this takes priority over any `output`
 *   on {@link external:csvToJSONParserParameters}
 *   (`cfg.parserParameters`); if neither set, defaults to `"json"`
 * @property {JSONSchema} [fieldSchemas=[]] E.g.,
 *   `{type: 'string'}, {type: 'integer'}`
 *   Can omit or pass null to default to average type in column
 * @property {UpgradeneededCallback} upgradeneeded Use if you need to clean
 *   up the old version of the database, e.g., to remote indexes. Runs before
 *   the automated addition of indicated stores and indexes
 */

/**
 * @param {JsonInfo} cfg
 * @param {JSON} cfg.json
 * @returns {Promise<Event>} A success event or rejects with `Error` with
 *   an `event` property set to `error` or `blocked`
*/
function importJSONToIndexedDB ({
  json,
  dbName, // 'myDb'
  storeName, // 'myRecords'
  keyPath, // '', [], etc
  autoIncrement = true,
  fieldNames = [],
  // eslint-disable-next-line no-shadow
  indexedDB = typeof window !== 'undefined'
    ? window.indexedDB
    : typeof global !== 'undefined'
      ? global.indexedDB
      : null,
  dbVersion = undefined,
  indexes = [],
  output = 'json',
  // Can omit or pass null to default to average type in column
  fieldSchemas = [], // {type: 'string'}, {type: 'integer'}
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

      const fNames = fieldNames === true
        ? json.splice(0, 1)
        : fieldNames;

      // Todo: Shape data based on whether `output` is `json` or `csv`
      if (Array.isArray(fNames)) {
        json = fNames.reduce((j, fName) => {
          // Todo: use `j` and `fName`
          return j;
        }, []);
      }
      // Todo: Use any `fieldSchemas` to manipulate `json`
      store.put(json);
    });
    req.addEventListener('success', (e) => {
      resolve(e);
    });
    req.addEventListener('error', (e) => {
      // eslint-disable-next-line no-console
      console.log('IndexedDB.open error', e);
      const err = new Error('error');
      err.event = e;
      reject(err);
    });
    req.addEventListener('blocked', (e) => {
      // eslint-disable-next-line no-console
      console.log('IndexedDB.open blocked', e);
      const err = new Error('error');
      err.event = e;
      reject(err);
    });
  });
}

/**
 * Of particular interest may be the `flatKeys` boolean property
 * to give `{"a.b":1,"a.c":2}` rather than `{"a":{"b":1,"c":2}}`
 * with columns `a.b,a.c` and data `1,2`
 * @external csvToJSONParserParameters
 * @see https://www.npmjs.com/package/csvtojson#user-content-parameters
*/

/**
 *
 * @param {JsonInfo} cfg Config object
 * @param {string} [cfg.csvFilePath]
 * @param {string} [cfg.csvString]
 * @param {external:csvToJSONParserParameters} [cfg.parserParameters]
 * @returns {Promise<Event>} A success event or rejects with `Error` with
 *   an `event` property set to `error` or `blocked`
 */
async function importCSVToIndexedDB (cfg) {
  const {
    csvFilePath, csvString, parserParameters, output: cfgOutput,
    ...remainingCfg
  } = cfg;
  const {output: parserOutput} = parserParameters;
  const output = cfgOutput || parserOutput;

  if (!csvFilePath && !csvString) {
    throw new TypeError('You must supply a `csvFilePath` or a `csvString`');
  }

  const json = csvFilePath
    ? await csv({
      ...parserParameters, output
    }).fromFile(csvFilePath)
    /**
     * For "csv":
     * [["1","2","3"], ["4","5","6"], ["7","8","9"]]
     *
     * For "json"
     * [
     *   {a:"1", b:"2", c:"3"},
     *   {a:"4", b:"5". c:"6"}
     * ]
     *
     * See also `flatKeys` for a subtype of `json`
     */
    : await csv({
      ...parserParameters, output
    }).fromString(csvString);

  return importJSONToIndexedDB({
    ...remainingCfg, json, output
  });
}

export {
  importJSONToIndexedDB,
  importCSVToIndexedDB
};
